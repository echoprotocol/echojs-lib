import BigNumber from 'bignumber.js';
import ByteBuffer from 'bytebuffer';
import { cloneDeep } from 'lodash';

import Api from './api';
import { operationById, operationByName } from './operations';
import { isString, isNumber, isObject, validateUnsignedSafeInteger } from '../utils/validators';
import PrivateKey from '../crypto/private-key';
import PublicKey from '../crypto/public-key';
import transaction, { signedTransaction } from '../serializer/transaction-type';
import { toBuffer } from '../serializer/type';
import Signature from '../crypto/signature';
import { ECHO_ASSET_ID, DYNAMIC_GLOBAL_OBJECT_ID } from '../constants';
import { EXPIRATION_SECONDS } from '../constants/api-config';

/** @typedef {[number,{[key:string]:any}]} _Operation */

class Transaction {

	/**
	 * @readonly
	 * @type {number}
	 */
	get refBlockNum() {
		this.checkFinalized();
		return this._refBlockNum;
	}

	/**
	 * @readonly
	 * @type {number}
	 */
	get refBlockPrefix() {
		this.checkFinalized();
		return this._refBlockPrefix;
	}

	/**
	 * @readonly
	 * @type {Array<_Operation>}
	 */
	get operations() { return cloneDeep(this._operations); }

	/**
	 * @readonly
	 * @type {boolean}
	 */
	get finalized() { return this._finalized; }

	/** @type {Api} */
	get api() { return this._api; }

	/** @param {Api} value */
	set api(value) {
		if (!(value instanceof Api)) throw new Error('value is not a Api instance');
		/**
		 * @private
		 * @type {Api}
		 */
		this._api = value;
	}

	/** @type {number|undefined} */
	get expiration() { return this._expiration; }

	/** @param {number|undefined} value */
	set expiration(value) {
		if (typeof value !== 'number') throw new Error('expiration is not a number');
		// TODO: more validators
		this._expiration = value;
	}

	/**
	 * @readonly
	 * @type {boolean}
	 */
	get hasAllFees() {
		for (const [, { fee }] of this.operations) {
			if (fee === undefined || fee.amount === undefined) return false;
		}
		return true;
	}

	/** @param {Api} api */
	constructor(api) {
		this.api = api;
		/**
		 * @private
		 * @type {Array<_Operation>}
		 */
		this._operations = [];
		/**
		 * @private
		 * @type {Array<{ privateKey:PrivateKey, publicKey:PublicKey }>}
		 */
		this._signers = [];
		/**
		 * @private
		 * @type {Array<Signature>}
		 */
		this._signatures = [];
		/**
		 * @private
		 * @type {boolean}
		 */
		this._finalized = false;
		/**
		 * @private
		 * @type {number}
		 */
		this._expiration = undefined;
	}

	checkNotFinalized() { if (this.finalized) throw new Error('already finalized'); }
	checkFinalized() { if (!this.finalized) throw new Error('transaction is not finalized'); }

	/**
	 * @param {string} name
	 * @param {{[key:string]:any}} [props]
	 * @returns {Transaction}
	 */
	addOperation(name, props = {}) {
		this.checkNotFinalized();
		if (name === undefined) throw new Error('name is missing');
		if (!isString(name) && !isNumber(name)) throw new Error('name is not a string or id');
		if (typeof name === 'number') validateUnsignedSafeInteger(name, 'operationId');
		if (!isObject(props)) throw new Error('argument "props" is not a object');
		const operationType = typeof name === 'number' ? operationById[name] : operationByName[name];
		if (!operationType) throw new Error(`unknown operation ${name}`);
		// TODO: proposal_create
		const operation = [operationType.id, props];
		operationType.validate(operation, false);
		this._operations.push(operation);
		return this;
	}

	/**
	 * @param {string} [assetId='1.3.0']
	 * @returns {Promise<void>}
	 */
	async setRequiredFees(assetId = ECHO_ASSET_ID) {
		this.checkNotFinalized();
		const operationTypes = this._operations;
		if (operationTypes.length === 0) throw new Error('no operations');
		/** @type Map<string,Array<_Operation>> */
		const operationsByNotDefaultFee = new Map();
		const defaultAssetOperations = [];
		const addOperationToAsset = (notDefaultAssetId, operation) => {
			if (notDefaultAssetId === ECHO_ASSET_ID) {
				defaultAssetOperations.push(operation);
				return;
			}
			const arr = operationsByNotDefaultFee.get(notDefaultAssetId);
			if (!arr) operationsByNotDefaultFee.set(notDefaultAssetId, [operation]);
			else arr.push(operation);
		};
		for (const op of operationTypes) {
			if (op[1].fee === undefined) addOperationToAsset(assetId, op);
			else if (op[1].fee.amount === undefined) addOperationToAsset(op[1].fee.asset_id, op);
		}
		const notDefaultAssetsIds = [...operationsByNotDefaultFee.keys()];
		await Promise.all([
			(async () => {
				if (defaultAssetOperations.length === 0) return;
				const fees = await this.api.getRequiredFees(defaultAssetOperations);
				for (let opIndex = 0; opIndex < fees.length; opIndex += 1) {
					let fee = fees[opIndex];
					if (fee.fee) {
						({ fee } = fee);
					}
					defaultAssetOperations[opIndex][1].fee = { asset_id: fee.asset_id, amount: fee.amount };
				}
			})(),
			...notDefaultAssetsIds.map(async (notDefaultAssetId) => {
				const ops = operationsByNotDefaultFee.get(notDefaultAssetId);
				/** @type {Array<{asset_id:string, amount:number}>} */
				const [fees, feePool] = await Promise.all([
					this.api.getRequiredFees(ops, notDefaultAssetId),
					this.api.getFeePool(notDefaultAssetId),
				]);
				const totalFees = new BigNumber(0);
				for (let opIndex = 0; opIndex < fees.length; opIndex += 1) {
					let fee = fees[opIndex];
					if (fee.fee) {
						({ fee } = fee);
					}
					ops[opIndex][1].fee = { asset_id: fee.asset_id, amount: fee.amount };
					totalFees.plus(fee.amount);
				}
				if (totalFees.gt(feePool)) throw new Error('fee pool overflow');
			}),
		]);
		return this;
	}

	/**
	 * @param {PrivateKey|Buffer} privateKey
	 * @param {PublicKey} [publicKey]
	 * @returns {Transaction}
	 */
	addSigner(privateKey, publicKey = privateKey.toPublicKey()) {
		this.checkNotFinalized();
		if (Buffer.isBuffer(privateKey)) privateKey = PrivateKey.fromBuffer(privateKey);
		if (!(privateKey instanceof PrivateKey)) throw new Error('private key is not instance of PrivateKey class');
		if (!(publicKey instanceof PublicKey)) throw new Error('public key is not instance of PublicKey class');
		const privateKeyHex = privateKey.toHex();
		for (const signer of this._signers) {
			if (signer.privateKey.toHex() === privateKeyHex) return this;
		}
		this._signers.push({ privateKey, publicKey });
		return this;
	}

	/** @returns {ByteBuffer} */
	toByteBuffer() {
		const result = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
		for (const operationData of this._operations) {
			const operationType = operationById[operationData[0]];
			operationType.appendToByteBuffer(operationData, result);
		}
		return result.copy(0, result.offset);
	}

	/**
	 * @param {PrivateKey=} _privateKey
	 */
	async sign(_privateKey) {
		console.log('TRANSACTION!!!!!!!!!!!!!!!!!!!');
		this.checkNotFinalized();
		if (_privateKey !== undefined) this.addSigner(_privateKey);
		if (!this.hasAllFees) await this.setRequiredFees();
		const dynamicGlobalChainData = await this.api.getObject(DYNAMIC_GLOBAL_OBJECT_ID, true);
		if (this.expiration === undefined) {
			const headBlockTimeSeconds = Math.ceil(new Date(`${dynamicGlobalChainData.time}Z`).getTime() / 1000);
			this.expiration = headBlockTimeSeconds + EXPIRATION_SECONDS;
		}

		const chainId = await this.api.getChainId();
		// one more check to avoid that the sign method was called several times
		// without waiting for the first call to be executed
		this.checkNotFinalized();
		this._finalized = true;
		/**
		 * @private
		 * @type {number|undefined}
		 */
		this._refBlockNum = dynamicGlobalChainData.head_block_number & 0xffff; // eslint-disable-line no-bitwise
		/**
		 * @private
		 * @type {number|undefined}
		 */
		this._refBlockPrefix = Buffer.from(dynamicGlobalChainData.head_block_id, 'hex').readUInt32LE(4);
		const transactionBuffer = toBuffer(transaction, {
			ref_block_num: this.refBlockNum,
			ref_block_prefix: this.refBlockPrefix,
			expiration: this.expiration,
			operations: this.operations,
			extensions: [],
		});

		this._signatures = this._signers.map(({ privateKey }) => {
			const chainBuffer = Buffer.from(chainId, 'hex');
			return Signature.signBuffer(Buffer.concat([chainBuffer, Buffer.from(transactionBuffer)]), privateKey);
		});

	}

	/**
	 * @returns {Promise<{ publicKeys:Array<string> }>}
	 */
	async getPotentialSignatures() {
		const transactionObject = this.finalized ? this.transactionObject : transaction.toObject({
			ref_block_num: 0,
			ref_block_prefix: 0,
			expiration: this.expiration === undefined ? 0 : this.expiration,
			operations: this.operations.map(([id, op]) => [id, { fee: { asset_id: ECHO_ASSET_ID, amount: 0 }, ...op }]),
			extensions: [],
		});
		const publicKeys = await this.api.getPotentialSignatures(transactionObject);
		return { publicKeys };
	}

	/**
	 , add	 * @readonly
	 * @type {import('../serializer/transaction-type').SignedTransactionObject}
	 */
	get transactionObject() {
		this.checkFinalized();
		return signedTransaction.toObject({
			ref_block_num: this.refBlockNum,
			ref_block_prefix: this.refBlockPrefix,
			expiration: this.expiration,
			operations: this.operations,
			extensions: [],
			signatures: this._signatures.map((signature) => signature.toBuffer()),
		});
	}

	/**
	 * @param {()=>* =} wasBroadcastedCallback
	 * @returns {Promise<*>}
	 */
	async broadcast(wasBroadcastedCallback) {
		if (!this.finalized) await this.sign();
		return this.api.broadcastTransactionWithCallback(this.transactionObject, wasBroadcastedCallback);
	}

}

export default Transaction;
