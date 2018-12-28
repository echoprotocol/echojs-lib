import { cloneDeep } from 'lodash';

import Echo from './index';
import { Operations } from '../serializer/operations';
import { isString, isObject } from '../utils/validator';

/** @typedef {[number,{[key:string]:any}]} Operation */

class Transaction {

	/**
	 * @readonly
	 * @type {Array<Operation>}
	 */
	get operations() { return cloneDeep(this._operations); }

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

	/** @param {Echo} echo */
	constructor(echo) {
		this.echo = echo;
		/**
		 * @private
		 * @type {Array<Operation>}
		 */
		this._operations = [];
	}

	/**
	 * @param {string} name
	 * @param {{[key:string]:any}} [props]
	 * @returns {Transaction}
	 */
	addOperation(name, props = {}) {
		// TODO: check finalization
		if (name === undefined) throw new Error('name is missing');
		if (!isString(name)) throw new Error('name is not a string');
		if (!isObject(props)) throw new Error('argument "props" is not a object');
		const operationType = Operations[name];
		if (!operationType) throw new Error(`unknown operation ${name}`);
		props.fee = { amount: 0, assetId: '1.3.0', ...props.fee };
		// TODO: proposal_create
		const operation = [operationType.id, props];
		if (!operationType.validate(operation)) throw new Error('invalid props');
		this._operations.push(operation);
		return this;
	}

}

export default Transaction;
