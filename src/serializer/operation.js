/* eslint-disable guard-for-in,no-restricted-syntax */
import { isObject, isArray } from '../utils/validator';

class Operation {

	/**
	 * @readonly
	 * @type {number}
	 */
	get id() { return this._id; }

	/**
	 * @param {number} id
	 * @param {{[key:string]:any}} options
	 */
	constructor(id, options) {
		this._id = id;
		this.options = options;
	}

	validate(operation = []) {
		if (!isArray(operation)) return false;

		if (operation[0] !== this.id) return false;
		if (!isObject(operation[1])) return false;

		const optionsEntries = Object.entries(this.options);

		for (const [key, validator] of optionsEntries) {
			const value = operation[1][key];
			if (!validator.validate(value)) return false;
		}

		return true;
	}

}

export default Operation;
