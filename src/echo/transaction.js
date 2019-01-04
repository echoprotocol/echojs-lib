import BigNumber from 'bignumber.js';
import { cloneDeep } from 'lodash';

import Echo from './index';
import { Operations, Transactions } from './operations';
import { isString, isObject } from '../utils/validators';
import PrivateKey from '../crypto/private-key';
import PublicKey from '../crypto/public-key';

/** @typedef {[number,{[key:string]:any}]} Operation */

class Transaction {

	/**
	 * @readonly
	 * @type {Array<Operation>}
	 */
	get operations() { return cloneDeep(this._operations); }

	/**
	 * @readonly
	 * @type {boolean}
	 */
	get finalized() { return this._finalized; }

	/** @type {Echo} */
	get echo() { return this._echo; }

	set echo(value) {
		if (!(value instanceof Echo)) throw new Error('value is not instance of Echo');
		/**
		 * @private
		 * @type {Echo}
		 */
		this._echo = value;
	}

	/** @type {number} */
	get expiration() { return this._expiration; }

	set expiration(value) {
		if (typeof value !== 'number') throw new Error('expiration is not a number');
		// TODO: more validators
		this._expiration = value;
	}

	/** @param {Echo} echo */
	constructor(echo) {
		this.echo = echo;
		/**
		 * @private
		 * @type {Array<Operation>}
		 */
		this._operations = [];
		/**
		 * @private
		 * @type {Array<{ privateKey:PrivateKey, publicKey:PublicKey }>}
		 */
		this._signers = [];
		/**
		 * @private
		 * @type {Array<Buffer>}
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

	checkNotFinalized() {
		if (this.finalized) throw new Error('already finalized');
	}

	/**
	 * @param {string} name
	 * @param {{[key:string]:any}} [props]
	 * @returns {Transaction}
	 */
	addOperation(name, props = {}) {
		this.checkNotFinalized();
		if (name === undefined) throw new Error('name is missing');
		if (!isString(name)) throw new Error('name is not a string');
		if (!isObject(props)) throw new Error('argument "props" is not a object');
		const operationType = Operations[name];
		if (!operationType) throw new Error(`unknown operation ${name}`);
		// TODO: proposal_create
		const operation = [operationType.id, props];
		operationType.check(operation, false);
		this._operations.push(operation);
		return this;
	}

	/**
	 * @param {string} [assetId='1.3.0']
	 * @returns {Promise<void>}
	 */
	async setRequiredFees(assetId = '1.3.0') {
		this.checkNotFinalized();
		const operations = this._operations;
		if (operations.length === 0) throw new Error('no operations');
		/** @type Map<string,Array<Operation>> */
		const operationsByNotDefaultFee = new Map();
		const defaultAssetOperations = [];
		const addOperationToAsset = (notDefaultAssetId, operation) => {
			if (notDefaultAssetId === '1.3.0') {
				defaultAssetOperations.push(operation);
				return;
			}
			const arr = operationsByNotDefaultFee.get(notDefaultAssetId);
			if (!arr) operationsByNotDefaultFee.set(notDefaultAssetId, [operation]);
			else arr.push(operation);
		};
		for (const op of operations) {
			if (op[1].fee === undefined) addOperationToAsset(assetId, op);
			else if (op[1].fee.amount === undefined) addOperationToAsset(op[1].fee.asset_id, op);
		}
		const notDefaultAssetsIds = [...operationsByNotDefaultFee.keys()];
		await Promise.all([
			(async () => {
				if (defaultAssetOperations.length === 0) return;
				const fees = await this.echo.api.getRequiredFees(defaultAssetOperations);
				for (let opIndex = 0; opIndex < fees.length; opIndex += 1) {
					const fee = fees[opIndex];
					defaultAssetOperations[opIndex][1].fee = { asset_id: fee.asset_id, amount: fee.amount };
				}
			})(),
			...notDefaultAssetsIds.map(async (notDefaultAssetId) => {
				const ops = operationsByNotDefaultFee.get(notDefaultAssetId);
				/** @type {Array<{asset_id:string, amount:number}>} */
				const [fees, feePool] = await Promise.all([
					this.echo.api.getRequiredFees(ops, notDefaultAssetId),
					this.echo.api.getFeePool(notDefaultAssetId),
				]);
				const totalFees = new BigNumber(0);
				for (let opIndex = 0; opIndex < fees.length; opIndex += 1) {
					const fee = fees[opIndex];
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
	 */
	addSigner(privateKey, publicKey = privateKey.toPublicKey()) {
		this.checkNotFinalized();
		if (Buffer.isBuffer(privateKey)) privateKey = PrivateKey.fromBuffer(privateKey);
		if (!(privateKey instanceof PrivateKey)) throw new Error('private key is not instance of PrivateKey class');
		if (!(publicKey instanceof PublicKey)) throw new Error('public key is not instance of PublicKey class');
		const privateKeyHex = privateKey.toHex();
		for (const signer of this._signers) {
			if (signer.privateKey.toHex() === privateKeyHex) return;
		}
		this._signers.push({ privateKey, publicKey });
	}

	async sign(privateKey) {
		this.checkNotFinalized();
		if (privateKey !== undefined) this.addSigner(privateKey);
		const [dynamicGlobalChainData] = await this.echo.api.getObjects(['2.1.0']);
		if (this.expiration === undefined) {
			const headBlockTimeSeconds = Math.ceil(new Date(dynamicGlobalChainData.time).getTime() / 1000);
			const nowSeconds = Math.ceil(new Date().getTime() / 1000);
			// the head block time should be updated every 3 seconds
			// if it isn't then help the transaction to expire (using head_block_sec)
			// if the user's clock is very far behind, use the head block time.
			this.expiration = nowSeconds - headBlockTimeSeconds > 30 ?
				headBlockTimeSeconds : Math.max(nowSeconds, headBlockTimeSeconds);
		}
		// one more check to avoid that the sign method was called several times
		// without waiting for the first call to be executed
		this.checkNotFinalized();
		const refBlockNum = dynamicGlobalChainData.head_block_number & 0xffff; // eslint-disable-line no-bitwise
		const refBlockPrefix = Buffer.from(dynamicGlobalChainData.head_block_id, 'hex').readUInt32LE(4);
		const transactionBuffer = Transactions.transaction.toBuffer(['transaction', ])
		this._signatures = this._signers.map(({ privateKey, publicKey }) => {
		});
		this.finalized = true;
	}

}

export default Transaction;
