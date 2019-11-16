import { ok } from 'assert';
import _ from 'lodash';

import Echo from '../echo/index';
import PrivateKey from '../crypto/private-key';
import { OPERATIONS_IDS } from '../constants';
import ContractTransaction from './ContractTransaction';
import decode from './decoders';
import { checkContractId, contractIdRegExp } from './utils/validators';

const NATHAN_ID = '1.2.12';

/** @typedef {import("./Contract").default} Contract */
/** @typedef {import("../../types/interfaces/Abi").AbiArgument} AbiArgument */
/** @typedef {import("./ContractResult").default} ContractResult */

/**
 * @typedef {Object} CallOptions
 * @property {string} [contractId]
 * @property {{ asset_id: string, amount: number | string | BigNumber }} [asset]
 * @property {string} [accountId]
 * @property {Echo} [echo]
 */

/**
 * @typedef {Object} SendOptions
 * @property {string} [contractId]
 * @property {string} [registrar]
 * @property {PrivateKey} [privateKey]
 * @property {{ amount:number|string|BigNumber, asset_id:string }} [value]
 */

export default class Method {

	/**
	 * @readonly
	 * @type {string}
	 */
	get code() { return this._code; }

	/**
	 * @readonly
	 * @type {Array<AbiArgument>}
	 */
	get outputs() { return _.cloneDeep(this._abiMethodOutputs); }

	/**
	 * @readonly
	 * @type {Contract}
	 */
	get contract() { return this._contract; }

	constructor(contract, abiMethodOutputs, code) {
		/**
		 * @private
		 * @type {Contract}
		 */
		this._contract = contract;
		/**
		 * @private
		 * @type {Array<AbiArgument>}
		 */
		this._abiMethodOutputs = abiMethodOutputs;
		/**
		 * @private
		 * @type {string}
		 */
		this._code = code;
	}

	/**
	 * @param {CallOptions} [options]
	 * @returns {Promise<Array<*>|*|null>}
	 */
	async call(options = {}) {
		const { stack } = new Error().stack;
		let {
			contractId,
			asset,
			caller,
			echo,
		} = options;
		if (contractId === undefined) {
			if (this._contract.address === undefined) throw new Error('no contractId');
			contractId = this._contract.address;
		} else checkContractId(contractId);
		if (asset === undefined) asset = { amount: 0, asset_id: '1.3.0' };
		if (caller === undefined) caller = NATHAN_ID;
		if (echo === undefined) {
			if (this._contract.echo === undefined) throw new Error('no echo instance');
			// eslint-disable-next-line prefer-destructuring
			echo = this._contract.echo;
		} else if (!(echo instanceof Echo)) throw new Error('invalid echo instance');
		try {
			// FIXME: remove @type when JSDoc of callContractNoChangingState will be fixed
			/** @type {string} */
			const rawResult = await echo.api.callContractNoChangingState(contractId, caller, asset, this.code);
			if (rawResult === '') {
				if (this._abiMethodOutputs.length === 0) return null;
				throw new Error('call failed');
			}
			return decode(rawResult, this._abiMethodOutputs.map(({ type }) => type));
		} catch (error) {
			error.stack = stack;
			throw error;
		}
	}

	/**
	 * @param {SendOptions} options
	 * @returns {ContractTransaction|Promise<ContractTransaction>}
	 */
	buildTransaction(options = {}) {
		if (options.registrar === undefined && options.privateKey === undefined) {
			throw new Error('no registar provided');
		}
		if (options.privateKey !== undefined && !(options.privateKey instanceof PrivateKey)) {
			throw new Error('invalid privateKey');
		}
		if (options.contractId !== undefined) {
			if (!contractIdRegExp.test(options.contractId)) throw new Error('invalid contractId format');
		} else {
			if (this._contract.address === undefined) throw new Error('contractId is not provided');
			options.contractId = this._contract.address;
		}
		if (options.registrar !== undefined) {
			if (!/^1\.2\.(0|[1-9]\d*)$/.test(options.registrar)) throw new Error('invalid registrar format');
			return this._createTransaction(options.contractId, options.registrar, options.privateKey, options.value);
		}
		return new Promise(async (resolve, reject) => {
			try {
				const publicKey = options.privateKey.toPublicKey();
				const [[registrar]] = await this._contract.echo.api.getKeyReferences([publicKey]);
				return resolve(this._createTransaction(
					options.contractId,
					registrar,
					options.privateKey,
					options.value,
				));
			} catch (err) {
				return reject(err);
			}
		});
	}

	/**
	 * @param {SendOptions} options
	 * @returns {Promise<ContractResult>}
	 */
	async broadcast(options = {}) {
		ok(options.privateKey !== undefined, 'private key not provided');
		const tx = await this.buildTransaction(options);
		let result;
		try {
			result = await tx.broadcast();
		} catch (err) {
			if (typeof err !== 'object' || err.code !== 1 || typeof err.message !== 'string') throw err;
			const expectedErrorPrefix = 'unspecified: Exception during execution: ';
			if (!err.message.startsWith(expectedErrorPrefix)) throw err;
			const execRes = JSON.parse(err.message.slice(expectedErrorPrefix.length));
			if (execRes.excepted !== 'RevertInstruction' || execRes.output.slice(0, 8) !== '08c379a0') {
				throw err;
			}
			const errorMessageLength = Number.parseInt(execRes.output.slice(72, 136), 16);
			const errorMessageBuffer = Buffer.from(execRes.output.slice(136), 'hex').slice(0, errorMessageLength);
			throw new Error(errorMessageBuffer.toString('utf8'));
		}
		return result;
	}

	/**
	 * @private
	 * @param {string} callee
	 * @param {string} registrar
	 * @param {PrivateKey} [privateKey]
	 * @param {{ amount:number|string|BigNumber, asset_id:string }} [value]
	 * @returns {ContractTransaction}
	 */
	_createTransaction(callee, registrar, privateKey, value) {
		value = { amount: 0, asset_id: '1.3.0', ...value };
		const result = new ContractTransaction(this._contract.echo.api, this)
			.addOperation(OPERATIONS_IDS.CONTRACT_CALL, {
				callee,
				code: this.code,
				registrar,
				value,
			});
		if (privateKey !== undefined) result.addSigner(privateKey);
		return result;
	}

}
