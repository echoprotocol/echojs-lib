import { isObject } from '../utils/validator';

class Operation {

	constructor(operationName, options) {
		this.operationName = operationName;
		this.options = options;
	}

    validate(operationObject = {}) {
	    if (!isObject(operationObject)) return false;

		if (operationObject.operationName !== this.operationName) return false;
		if (!isObject(operationObject.options)) return false;

		const optionsEntries = Object.entries(this.options);

		for (const [key, validator] in optionsEntries) {
			const value = operationObject.options[key];
			if (!value) return false;
			if (!validator.validate(value)) return false;
		}

		return true;
	}

}

export default Operation;
