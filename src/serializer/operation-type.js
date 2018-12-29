/* eslint-disable guard-for-in,no-restricted-syntax */
import { isObject, isArray } from '../utils/validator';
import { unrequiredAsset } from './types';

class OperationType {

	/**
	 * @readonly
	 * @type {number}
	 */
	get id() { return this._id; }

	constructor(id, options) {
		this._id = id;
		this.options = options;
	}

	check(operation = [], feeIsRequired = true) {
		if (!isArray(operation)) throw new Error('Operation should be an array');

		if (operation[0] !== this.id) {
			throw new Error(`Operation id doesn't match with ${this.id}`);
		}
		if (!isObject(operation[1])) throw new Error('Second element should be a object');

		const optionsEntries = Object.entries(this.options);

		for (const [key, validator] of optionsEntries) {
			const value = operation[1][key];
			if (!feeIsRequired && key === 'fee') {
				if (!unrequiredAsset.isValid(value)) throw new Error('Fee parameter is invalid');
				continue;
			}
			if (!validator.isValid(value)) throw new Error(`Parameter ${key} is invalid`);
		}

		return true;
	}

	isValid(operation = [], feeIsRequired = true) {
		try {
			return this.check(operation, feeIsRequired);
		} catch (_) {
			return false;
		}
	}

}

export default OperationType;
