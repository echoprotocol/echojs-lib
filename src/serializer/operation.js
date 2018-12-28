/* eslint-disable guard-for-in,no-restricted-syntax */
import { isObject, isArray } from '../utils/validator';

class Operation {

	constructor(operationId, options) {
		this.operationId = operationId;
		this.options = options;
	}

	validate(operation = []) {
		if (!isArray(operation)) return false;

		if (operation[0] !== this.operationId) return false;
		if (!isObject(operation[1])) return false;

		const optionsEntries = Object.entries(this.options);

		for (const [key, validator] in optionsEntries) {
			const value = operation[1][key];
			if (!value) return false;
			if (!validator.validate(value)) return false;
		}

		return true;
	}

}

export default Operation;
