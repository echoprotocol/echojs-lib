class Type {

	constructor(validatorFunc) {
		this.validatorFunc = validatorFunc;
	}

	isValid(value) {
		return this.validatorFunc(value);
	}

}

export default Type;
