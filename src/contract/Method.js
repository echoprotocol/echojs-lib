import BigNumber from 'bignumber.js';

import { ECHO_ASSET_ID, OPERATIONS_IDS } from '../constants';
import { contract as contractOperations } from '../serializers/protocol';
import { assetId, contractId as contractId, accountId } from '../serializers/chain/id/protocol';
import { operation } from '../serializers';

/** @typedef {import("../crypto/private-key").default} PrivateKey */
/** @typedef {import("../echo").default} Echo */
/** @typedef {import("../echo/transaction").default} Transaction */
/** @typedef {import("../serializers/basic/integers").UInt64Serializer} UInt64Serializer */
/** @typedef {import("./Contract").default} Contract */

/** @typedef {'create' | 'call'} MethodType */

/**
 * @typedef {Object} CommonOperationOptions
 * @property {{ amount?: UInt64Serializer['__TInput__'], assetId?: string }} [fee]
 * @property {string} [registrar]
 * @property {UInt64Serializer['__TInput__'] | { amount?: UInt64Serializer['__TInput__'], assetId?: string }} [value]
 */

/**
 * @typedef {CommonOperationOptions & _CreateOperationOptions} CreateOperationOptions
 * @typedef {Object} _CreateOperationOptions
 * @property {boolean} [ethAccuracy]
 * @property {string} [supportedAssetId]
 */

/**
 * @typedef {CommonOperationOptions & _CallOperationOptions} CallOperationOptions
 * @typedef {Object} _CallOperationOptions
 * @property {string} [callee]
 */

/**
 * @template {MethodType} T
 * @typedef {{ create: CreateOperationOptions, call: CallOperationOptions }[T]} OperationOptions
 */

/**
 * @typedef {Object} _RawOperation
 * @property {[typeof OPERATIONS_IDS['CONTRACT_CREATE'], typeof contractOperations['create']['__TInput__']]} create
 * @property {[typeof OPERATIONS_IDS['CONTRACT_CALL'], typeof contractOperations['call']['__TInput__']]} call
 */

/**
 * @template {MethodType} T
 * @typedef {T extends any ? _RawOperation[T] : never} RawOperation
 */

/** @typedef {{ echo?: Echo }} OptionsWithEcho */

/** @template {MethodType} T */
class Method {

	/**
	 * @readonly
	 * @type {Buffer}
	 */
	get code() { return this._code; }

	/**
	 * @readonly
	 * @type {Contract}
	 */
	get contract() { return this._contract; }

	/**
	 * @readonly
	 * @type {{ create: typeof OPERATIONS_IDS['CONTRACT_CREATE'], call: typeof OPERATIONS_IDS['CONTRACT_CALL'] }[T]}
	 */
	get operationId() {
		return this._type === 'create' ? OPERATIONS_IDS.CONTRACT_CREATE : OPERATIONS_IDS.CONTRACT_CALL;
	}

	/**
	 * @param {Buffer} code
	 * @param {Contract} contract
	 * @param {T} type
	 */
	constructor(code, contract, type) {
		/**
		 * @private
		 * @type {Buffer}
		 */
		this._code = code;
		/**
		 * @private
		 * @type {Contract}
		 */
		this._contract = contract;
		/**
		 * @private
		 * @type {T}
		 */
		this._type = type;
	}

	/**
	 * @param {OperationOptions<T>} [options]
	 * @returns {RawOperation<T>}
	 */
	toOperation(options = {}) {
		/** @type {{ amount: UInt64Serializer['__TInput__'], asset_id: string } | undefined} */
		const fee = options.fee === undefined ? undefined : {
			amount: options.fee.amount === undefined ? undefined : options.fee.amount,
			asset_id: options.fee.assetId === undefined ? ECHO_ASSET_ID : options.fee.assetId,
		};
		const registrar = options.registrar !== undefined ? options.registrar : this.contract.registrarId;
		let value = options.value === undefined ? { amount: 0, asset_id: ECHO_ASSET_ID } : options.value;
		if (typeof value !== 'object' || value instanceof BigNumber) {
			value = { amount: value, asset_id: ECHO_ASSET_ID };
		}
		return operation.toRaw([this.operationId, {
			...options,
			fee,
			registrar,
			value,
			code: this.code.toString('hex'),
		}], true);
	}

	/**
	 * @param {Transaction} tx
	 * @param {OperationOptions<T>} [options]
	 */
	addToTransaction(tx, options) { tx.addOperation(...this.toOperation(options)); }

	/**
	 * @param {OperationOptions<T> & OptionsWithEcho} [options]
	 * @returns {Transaction}
	 */
	buildTransaction(options = {}) {
		const echo = options.echo === undefined ? this.contract.getEcho() : options.echo;
		return echo.createTransaction().addOperation(...this.toOperation(options));
	}

	/**
	 * @param {PrivateKey} privateKey
	 * @param {OperationOptions<T> & OptionsWithEcho} options
	 * @returns {Promise<unknown>}
	 */
	async send(privateKey, options) {
		const result = await this.buildTransaction(options).addSigner(privateKey).broadcast();
		return result;
	}

}

/** @extends {Method<'create'>} */
export class DeployMethod extends Method {

	/**
	 * @param {Buffer} code
	 * @param {Contract} contract
	 */
	constructor(code, contract) { super(code, contract, 'create'); }

	/**
	 * @param {OperationOptions<'create'>} [options]
	 * @returns {RawOperation<'create>'}
	 */
	toOperation(options = {}) {
		const ethAccuracy = options.ethAccuracy === undefined ? false : options.ethAccuracy;
		if (typeof ethAccuracy !== 'boolean') throw new Error('field "ethAccuracy" is not a boolean');
		/** @type {string | undefined} */
		const supportedAssetId = options.supportedAssetId === undefined
			? undefined : assetId.toRaw(options.supportedAssetId);
		return super.toOperation({
			...options,
			eth_accuracy: ethAccuracy,
			supported_asset_id: supportedAssetId,
		});
	}

}

/** @extends {Method<'call'>} */
export class CallMethod extends Method {

	/**
	 * @param {Buffer} code
	 * @param {Contract} contract
	 */
	constructor(code, contract) { super(code, contract, 'call'); }

	/**
	 * @param {OperationOptions<'call'>} [options]
	 * @returns {RawOperation<'call'>}
	 */
	toOperation(options = {}) {
		const callee = contractId.toRaw(options.callee === undefined ? this.contract.getId() : options.callee);
		return super.toRaw({
			...options,
			callee,
		});
	}

	/**
	 * @param {{ contractId?: string, registrar?: string, assetId?: string }} [options]
	 * @returns {Promise<unknown>}
	 */
	async call(options = {}) {
		const echo = options.echo === undefined ? this.contract.getEcho() : options.echo;
		const _contractId = contractId.toRaw(options.contractId === undefined
			? this.contract.getId() : options.contractId);
		const registrar = accountId.toRaw(options.registrar === undefined
			? this.contract.getRegistrar() : options.registrar);
		const _assetId = assetId.toRaw(options.assetId === undefined ? ECHO_ASSET_ID : options.assetId);
		const codeHex = this.code.toString('hex');
		const result = await echo.api.callContractNoChangingState(_contractId, registrar, _assetId, codeHex);
		return result;
	}

}
