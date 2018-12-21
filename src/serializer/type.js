class Type {

	constructor(validatorFunc) {
		this.validatorFunc = validatorFunc;
	}

	validate(value) {
		return this.validatorFunc(value);
	}

}

export default Type;
