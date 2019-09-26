import BigNumber from 'bignumber.js';

import { ECHO_ASSET_ID, OPERATIONS_IDS } from '../constants';
import { contract as contractOperations } from '../serializers/protocol';

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
 * @template {MethodType} T
 * @typedef {typeof contractOperations[T]['__TInput__']} RawOperation
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
		const fee = options.fee === undefined ? { amount: 0, assetId: ECHO_ASSET_ID } : {
			amount: options.fee.amount || 0,
			assetId: options.fee.assetId === undefined ? ECHO_ASSET_ID : options.fee.assetId,
		};
		const registrar = options.registrar !== undefined ? options.registrar : this.contract.registrarId;
		let value = options.value === undefined ? { amount: 0, assetId: ECHO_ASSET_ID } : options.value;
		if (typeof value !== 'object' || value instanceof BigNumber) {
			value = { amount: value, assetId: ECHO_ASSET_ID };
		}
		return contractOperations[this._type].toRaw({
			...options,
			fee,
			registrar,
			value,
		});
	}

	/**
	 * @param {Transaction} tx
	 * @param {OperationOptions<T>} [options]
	 */
	addToTransaction(tx, options) { tx.addOperation(this.operationId, this.toOperation(options)); }

	/**
	 * @param {OperationOptions<T> & OptionsWithEcho} [options]
	 * @returns {Transaction}
	 */
	buildTransaction(options = {}) {
		const echo = options.echo === undefined ? this.contract.echo : options.echo;
		if (!echo) throw new Error('echo instance is not provided');
		return echo.createTransaction().addOperation(this.toOperation(options));
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
