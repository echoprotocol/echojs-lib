import cloneDeep from 'clone-deep';

import { accountId, contractId } from '../serializers/chain/id/protocol';
import { PrivateKey } from '../crypto';
import { getSignature, getMethodHash, checkAbiFormat } from './utils/solidity-utils';
import encode from './encoders';
import { CallMethod, DeployMethod } from './Method';
import Echo from '../echo';

/** @typedef {import("../../types/interfaces/Abi").Abi} Abi */
/** @typedef {import("../echo").default} Echo */

export default class Contract {

	/**
	 * @readonly
	 * @type {readonly string[]}
	 */
	get constructorArgsType() { return this._constructorArgsType; }

	/**
	 * @readonly
	 * @type {boolean}
	 */
	get hasFallback() { return this._hasFallback; }

	/**
	 * @readonly
	 * @type {{ [key: string]: (...args: any[]) => CallMethod }}
	 */
	get methods() { return this._methods; }

	/**
	 * @readonly
	 * @type {ReadonlySet<string>}
	 */
	get namesDublications() { return new Set(this._namesDublications); }

	/** @type {Abi} */
	get abi() { return cloneDeep(this._abi); }
	set abi(value) {
		checkAbiFormat(value);
		let fallbackProvided = false;
		let constructorTypeProvided = false;
		const methods = {};
		const dublications = new Set();
		for (const abiElement of value) {
			switch (abiElement.type) {
				case 'fallback':
					fallbackProvided = true;
					break;
				case 'constructor':
					if (constructorTypeProvided) throw new Error('several constructor signatures detected');
					constructorTypeProvided = true;
					this._constructorArgsType = abiElement.inputs.map(({ type }) => type);
					break;
				case 'function': {
					const signature = getSignature(abiElement);
					const hash = getMethodHash(abiElement);
					const shortHash = hash.slice(0, 8);
					// eslint-disable-next-line no-loop-func
					const method = (...args) => {
						if (args.length !== abiElement.inputs.length) throw new Error('invalid arguments count');
						const encodingInput = args.map((argument, index) => ({
							value: argument,
							type: abiElement.inputs[index].type,
						}));
						const code = shortHash + encode(encodingInput);
						return new CallMethod(Buffer.from(code, 'hex'), this);
					};
					if (methods[abiElement.name]) {
						dublications.add(abiElement.name);
						delete methods[abiElement.name];
					} else if (!dublications.has(abiElement.name)) methods[abiElement.name] = method;
					methods[signature] = method;
					methods[`0x${shortHash}`] = method;
					break;
				}
				case 'event':
					break;
				default:
					throw new Error(`unknown method type ${abiElement.type}`);
			}
		}
		/**
		 * @private
		 * @type {Abi}
		 */
		this._abi = cloneDeep(value);
		/**
		 * @private
		 * @type {boolean}
		 */
		this._hasFallback = fallbackProvided;
		/**
		 * @private
		 * @type {string[]}
		 */
		this._constructorArgsType = [];
		/**
		 * @private
		 * @type {{ [name: string]: (...args: any[]) =>  }}
		 */
		this._methods = methods;
		/**
		 * @private
		 * @type {Set<string>}
		 */
		this._namesDublications = dublications;
		if (this.namesDublications.size > 0) {
			// TODO: think about this case
			// eslint-disable-next-line no-console
			console.warn('[WARN] Found several functions with the same name');
			// eslint-disable-next-line no-console
			console.warn('       To call them, use their signatures or hashes');
			// eslint-disable-next-line no-console
			console.warn('       Get a list of duplicate names from a field "namesDublications"');
		}
	}

	/** @type {Echo | undefined} */
	get echo() { return this._echo; }
	set echo(value) {
		if (value !== undefined && !(value instanceof Echo)) throw new Error('echo is not a instance of Echo');
		this._echo = value;
	}

	/** @type {string | undefined} */
	get id() { return this._id; }
	set id(value) {
		/**
		 * @private
		 * @type {string | undefined}
		 */
		this._id = value === undefined ? undefined : contractId.toRaw(value);
		return this.id;
	}

	/** @type {{ id: string, privateKey?: PrivateKey } | undefined} */
	get registrar() { return this._registrar; }
	set registrar(value) {
		if (value !== undefined) {
			accountId.toRaw(value.id);
			if (value.privateKey !== undefined && !(value.privateKey instanceof PrivateKey)) {
				throw new Error('registrar private key is not instance of PrivateKey');
			}
		}
		/**
		 * @private
		 * @type {{ id: string, privateKey?: PrivateKey } | undefined}
		 */
		this._registrar = value;
		return this.registrar;
	}

	/**
	 * @readonly
	 * @type {string}
	 */
	get registrarId() {
		if (this.registrar === undefined) throw new Error('unknown contract registrar');
		return this.registrar.id;
	}

	/**
	 * @param {Abi} abi
	 * @param {Object} [options]
	 * @param {Echo} [options.echo]
	 * @param {string} [options.id]
	 * @param {string | { id: string, privateKey?: PrivateKey }} [options.registrar]
	 */
	constructor(abi, options = {}) {
		this.abi = abi;
		this.echo = options.echo;
		this.id = options.id;
		this.setRegistrar(options.registrar);
	}

	/** @returns {string} */
	getId() {
		if (this.id === undefined) throw new Error('contract id is unknown');
		return this.id;
	}

	/** @returns {Echo} */
	getEcho() {
		if (!this.echo) throw new Error('not echo instance');
		return this.echo;
	}

	/** @returns {string} */
	getRegistrar() {
		if (this.registrar === undefined) throw new Error('registrar is unknown');
		return this.registrar;
	}

	/** @param {string | { id: string, privateKey?: PrivateKey } | undefined} registrar */
	setRegistrar(registrar) { this.registrar = typeof registrar === 'string' ? { id: registrar } : registrar; }

	/**
	 * @param {Buffer | string} bytecode
	 * @param  {...any[]} args
	 * @returns {DeployMethod}
	 */
	deploy(bytecode, ...args) {
		if (Buffer.isBuffer(bytecode)) bytecode = bytecode.toString('hex');
		else {
			if (typeof bytecode !== 'string') throw new Error('invalid bytecode type');
			if (!/^([\da-fA-F]{2})*$/.test(bytecode)) throw new Error('bytecode is not a hex string');
			bytecode = bytecode.toLowerCase();
		}
		if (args.length !== this.constructorArgsType.length) throw new Error('invalid arguments count');
		const encodingInput = args.map((argument, index) => ({
			value: argument,
			type: this.constructorArgsType[index],
		}));
		const code = bytecode + encode(encodingInput);
		return new DeployMethod(Buffer.from(code, 'hex'), this);
	}

}
