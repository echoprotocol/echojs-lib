/* eslint-disable guard-for-in,no-restricted-syntax */
import { isObject, isArray } from '../utils/validator';

class OperationType {

	constructor(operationId, options) {
		this.operationId = operationId;
		this.options = options;
	}

	check(operation = []) {
		if (!isArray(operation)) throw new Error('Operation should be an array');

		if (operation[0] !== this.operationId) throw new Error(`Operation number doesn't match with ${this.operationId}`);
		if (!isObject(operation[1])) throw new Error('Second element should be a object');

		const optionsEntries = Object.entries(this.options);

		for (const [key, validator] in optionsEntries) {
			const value = operation[1][key];
			if (!value) throw new Error(`Parameter ${key} should exist`);
			if (!validator.isValid(value)) throw new Error(`Parameter ${key} is invalid`);
		}

		return true;
	}

	isValid(operation = []) {
		try {
			return this.check(operation);
		} catch (_) {
			return false;
		}
	}

}

export default OperationType;
