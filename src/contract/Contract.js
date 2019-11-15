import { ok, notStrictEqual } from 'assert';
import BigNumber from 'bignumber.js';
import { cloneDeep } from 'lodash';

import { OPERATIONS_IDS, PROTOCOL_OBJECT_TYPE_ID } from '../constants';
import PrivateKey from '../crypto/private-key';
import Echo, { echo as defaultEcho } from '../echo';

import encode from './encoders';
import decode from './decoders';
import Method from './Method';
import { getMethodHash, getSignature, checkAbiFormat } from './utils/solidity-utils';
import { checkContractId } from './utils/validators';

/** @typedef {import("../../types/interfaces/Abi").Abi} Abi */
/** @typedef {import("../../types/echo/transaction").OPERATION_RESULT_VARIANT} OPERATION_RESULT_VARIANT */

class Contract {

	/**
	 * @param {Buffer|string} code
	 * @param {PrivateKey} privateKey
	 * @param {Object} [options]
	 * @param {Array<*>} [options.args]
	 * @param {Abi} [options.abi]
	 * @param {boolean} [options.ethAccuracy]
	 * @param {string} [options.supportedAssetId]
	 * @param {string} [options.accountId]
	 * @param {Echo} [options.echo]
	 * @param {Object} [options.value]
	 * @param {number|string|BigNumber} [options.value.amount=0]
	 * @param {string} [options.value.assetId]
	 * @returns {Promise<Contract|string>}
	 */
	static async deploy(
		code,
		privateKey,
		options,
	) {
		const echo = options.echo || defaultEcho;

		if (Buffer.isBuffer(code)) code = code.toString('hex');
		else if (typeof code !== 'string') throw new Error('invalid code type');
		if (code.startsWith('0x')) code = code.slice(2);
		if (!(echo instanceof Echo)) throw new Error('echo is not instance of Echo class');
		if (!(privateKey instanceof PrivateKey)) throw new Error('private key is not instance of PrivateKey class');
		if (!options) options = {};
		if (options.abi !== undefined) checkAbiFormat(options.abi);
		if (options.ethAccuracy === undefined) options.ethAccuracy = false;
		else if (typeof options.ethAccuracy !== 'boolean') throw new Error('ethAccouracy is not boolean');
		if (options.supportedAssetId !== undefined) {
			if (typeof options.supportedAssetId !== 'string') throw new Error('supportedAssetId invalid id');
			if (/^1\.3\.(0|[1-9]\d*)$/.test(options.supportedAssetId) === false) {
				throw new Error('invalid supportedAssetId format');
			}
		}
		if (!options.value) options.value = {};
		if (options.value.amount === undefined) {
			options.value.amount = 0;
		} else if (typeof options.value.amount === 'number') {
			if (options.value.amount < 0) throw new Error('amount is negative');
			if (Number.isSafeInteger(options.value.amount)) throw new Error('amount is not safe integer');
		} else if (BigNumber.isBigNumber(options.value.amount)) {
			options.value.amount = options.value.amount.toString(10);
		} else if (typeof options.value.amount !== 'string') {
			throw new Error('invalid amount type');
		} else if (/^(0|[1-9]\d*)$/.test(options.value.amount) === false) {
			throw new Error('amount is not non-negative integer');
		}
		if (!options.value.assetId) options.value.assetId = '1.3.0';
		else if (typeof options.value.assetId !== 'string') throw new Error('assetId is not string');
		else if (/^1\.3\.(0|[1-9]\d*)$/.test(options.value.assetId) === false) {
			throw new Error('invalid assetId format');
		}
		const [[accountIds]] = await echo.api.getKeyReferences([privateKey.toPublicKey()]);
		const accountId = options.accountId || accountIds;
		if (!accountId) throw new Error('No account with provided private key');
		let rawArgs = '';
		if (options.args !== undefined) {
			ok(Array.isArray(options.args), 'option "args" is not an array');
			ok(options.abi !== undefined, 'abi is not provided');
			const initArgsTypes = options.abi.find(({ type }) => type === 'constructor').inputs.map(({ type }) => type);
			ok(initArgsTypes.length === options.args.length, 'invalid arguments count');
			rawArgs = encode(options.args.map((arg, index) => ({ value: arg, type: initArgsTypes[index] })));
		}
		const contractId = await echo.createTransaction().addOperation(OPERATIONS_IDS.CONTRACT_CREATE, {
			code: code + rawArgs,
			eth_accuracy: options.ethAccuracy,
			registrar: accountId,
			supported_asset_id: options.supportedAssetId,
			value: { amount: options.value.amount, asset_id: options.value.assetId },
		}).addSigner(privateKey).broadcast()
			.then(async (res) => {
				/** @type {import("../../types/echo/transaction").OPERATION_RESULT<OPERATION_RESULT_VARIANT.OBJECT>} */
				const [, opResId] = res[0].trx.operation_results[0];
				const execRes = await echo.api.getContractResult(opResId, true).then((result) => result[1].exec_res);
				if (execRes.excepted !== 'None') throw execRes;
				const contractTypeId = PROTOCOL_OBJECT_TYPE_ID.CONTRACT;
				return `1.${contractTypeId}.${new BigNumber(execRes.new_address.slice(2), 16).toString(10)}`;
			})
			.catch((err) => {
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
			});
		if (options.abi === undefined) return contractId;
		return new Contract(options.abi, { echo, contractId });
	}

	/** @returns {Set<string>} */
	get namesDublications() { return new Set(this._namesDublications); }

	/**
	 * @readonly
	 * @type {boolean}
	 */
	get hasFallback() { return this._hasFallback; }

	/** @type {Abi} */
	get abi() { return cloneDeep(this._abi); }

	set abi(value) {
		checkAbiFormat(value);
		/** @type {{[nameOrHashOrSignature:string]:()=>Method>}} */
		const newMethodsMap = {};
		/**
		 * @private
		 * @type {Set<string>}
		 */
		this._namesDublications = new Set();
		/**
		 * @private
		 * @type {{[hash: string]: { name:string, args:Array<{ type: string, name: string }> }}}
		 */
		this._logs = {};
		/**
		 * @private
		 * @type {boolean}
		 */
		this._hasFallback = false;
		for (const abiFunction of value) {
			if (abiFunction.type === 'fallback') {
				this._hasFallback = true;
				continue;
			}
			if (!['function', 'event'].includes(abiFunction.type)) continue;
			const signature = getSignature(abiFunction);
			const hash = getMethodHash(abiFunction);
			const shortHash = hash.slice(0, 8);
			if (abiFunction.type === 'event') {
				this._logs[hash] = { name: abiFunction.name, args: abiFunction.inputs };
				continue;
			}
			const method = (...args) => {
				if (args.length !== abiFunction.inputs.length) throw new Error('invalid arguments count');
				const encodingInput = args.map((argument, index) => ({
					value: argument,
					type: abiFunction.inputs[index].type,
				}));
				const code = shortHash + encode(encodingInput);
				return new Method(this, abiFunction.outputs, code);
			};
			if (newMethodsMap[abiFunction.name]) {
				this._namesDublications.add(abiFunction.name);
				delete newMethodsMap[abiFunction.name];
			} else if (!this._namesDublications.has(abiFunction.name)) {
				newMethodsMap[abiFunction.name] = method;
			}
			newMethodsMap[signature] = method;
			newMethodsMap[`0x${shortHash}`] = method;
		}
		if (this._namesDublications.size > 0) {
			// TODO: think about this case
			// eslint-disable-next-line no-console
			console.warn('[WARN] Found several functions with the same name');
			// eslint-disable-next-line no-console
			console.warn('       To call them, use their signatures or hashes');
			// eslint-disable-next-line no-console
			console.warn('       Get a list of duplicate names from a field "namesDublications"');
		}
		/**
		 * @private
		 * @type {Abi}
		 */
		this._abi = cloneDeep(value);
		/**
		 * @private
		 * @type {{[nameOrHashOrSignature:string]:()=>Method}}
		 */
		this._methods = newMethodsMap;
	}

	/** @type {Echo|undefined} */
	get echo() { return this._echo; }

	set echo(value) {
		if (!(value instanceof Echo)) throw new Error('value is not a instance of Echo');
		/** @type Echo */
		this._echo = value;
	}

	/** @type {string|undefined} */
	get address() { return this._address; }

	set address(value) {
		checkContractId(value);
		/** @type {string|undefined} */
		this._address = value;
	}

	/** @returns {{[nameOrHashOrSignature:string]:()=>Method}} */
	get methods() { return { ...this._methods }; }

	/**
	 * @param {Abi} abi
	 * @param {Echo} [echo]
	 * @param {string} [contractId]
	 */
	constructor(abi, { echo, contractId } = {}) {
		this.abi = abi;
		if (echo !== undefined) this.echo = echo;
		if (contractId !== undefined) this.address = contractId;
	}

	/**
	 * @param {PrivateKey} privateKey
	 * @param {number|string|BigNumber} value
	 * @param {string} [assetId]
	 */
	fallback(privateKey, value, assetId) {
		notStrictEqual(value, undefined, 'value is missing');
		if (typeof value === 'number') {
			ok(Number.isInteger(value), 'value is not an integer');
			ok(value > 0, 'value is not positive');
			ok(Number.isSafeInteger(value), 'loss of accuracy (use string or BigNumber)');
		} else ok(typeof value === 'string' || BigNumber.isBigNumber(value), 'invalid value type');
		if (assetId === undefined) assetId = '1.3.0';
		else if (/^1\.3\.(0|[1-9]\d*)$/.test(assetId) === false) throw new Error('invalid assetId format');
		return new Method(this, [], '').broadcast({ privateKey, value: { amount: value, asset_id: assetId } });
	}

	/**
	 * @param {string} code
	 * @param {PrivateKey} privateKey
	 * @param {Object} [options]
	 * @param {Array<*>} [options.args]
	 * @param {boolean} [options.ethAccuracy]
	 * @param {string} [options.supportedAssetId]
	 * @param {Object} [options.value]
	 * @param {number|string|BigNumber} [options.value.amount]
	 * @param {string} [options.value.assetId]
	 * @returns {Promise<Contract>}
	 */
	async deploy(code, privateKey, options = {}) {
		ok(options.abi === undefined, 'abi duplicate');
		options.abi = this.abi;
		/** @type {Contract} */
		const newContract = await Contract.deploy(code, privateKey, options);
		this.address = newContract.address;
		return this;
	}

	parseLogs(logs) {
		const result = {};
		for (const { log, data } of logs) {
			const { name, args } = this._logs[log[0]];
			result[name] = {};
			const decoded = decode(data, args.map(({ type }) => type));
			for (let i = 0; i < args.length; i += 1) {
				result[name][args[i].name] = decoded[i];
			}
		}
		return result;
	}

}

export default Contract;
