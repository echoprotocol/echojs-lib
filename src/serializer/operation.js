/* eslint-disable no-restricted-syntax,no-continue */
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

	/**
	 * @param {Array<Operation>} operation
	 * @param {Object} [opts]
	 * @param {boolean} [opts.feeIsRequired=true]
	 */
	validate(operation = [], opts = {}) {
		const feeIsRequired = typeof opts.feeIsRequired === 'boolean' ? opts.feeIsRequired : true;

		if (!isArray(operation)) return false;

		if (operation[0] !== this.id) return false;
		if (!isObject(operation[1])) return false;

		const optionsEntries = Object.entries(this.options);

		for (const [key, validator] of optionsEntries) {
			const value = operation[1][key];
			if (!feeIsRequired && key === 'fee') {
				if (value === undefined) continue;
				const amount = value.amount === undefined ? 0 : value.amount;
				if (!validator.validate({ assetId: value.assetId, amount })) return false;
			} else if (!validator.validate(value)) return false;
		}

		return true;
	}

}

export default Operation;
