import { accountId, contractId } from '../serializers/chain/id/protocol';
import { PrivateKey } from '../crypto';
import Echo from '../echo';

/** @typedef {import("../../types/interfaces/Abi").Abi} Abi */

export default class Contract {

	/** @type {Abi} */
	get abi() { return this._abi; }
	set abi(value) {
		/**
		 * @private
		 * @type {Abi}
		 */
		this._abi = value;
		/**
		 * @private
		 * @type {boolean}
		 */
		this._hasFallback = false;
		/**
		 * @private
		 * @type {string[]}
		 */
		this._constructorArgsType = [];
		/**
		 * @private
		 * @type {{ [name: string]: (...args: any[]) =>  }}
		 */
		this._methods = {};
		for (const method of value) {
			switch (method.type) {
				case 'fallback':
					this._hasFallback = true;
					break;
				case 'constructor':
					this._constructorArgsType = method.inputs.map(({ type }) => type);
					break;
				case 'function':
				case 'event':
					break;
				default:
					throw new Error(`unknown method type ${method.type}`);
			}
		}
	}

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
		/** @type {Echo | undefined} */
		this.echo = options.echo;
		this.id = options.id;
		this.setRegistrar(options.registrar);
	}

	/** @param {string | { id: string, privateKey?: PrivateKey } | undefined} registrar */
	setRegistrar(registrar) { this.registrar = typeof registrar === 'string' ? { id: registrar } : registrar; }

}
