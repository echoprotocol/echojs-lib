class Type {

	/**
	 * @param {(value:any)=>boolean} validatorFunc
	 * @param {(value:any)=>Array<number>} toBytesConverter
	 */
	constructor(validatorFunc, toBytesConverter) {
		this.validatorFunc = validatorFunc;
		/**
		 * @private
		 * @type {(value:any)=>Array<number>}
		 */
		this._toBytesConverter = toBytesConverter;
	}

	isValid(value) {
		return this.validatorFunc(value);
	}

	toBytes(value) {
		if (!this.isValid(value)) throw new Error('invalid value');
		return this._toBytesConverter(value);
	}

}

export default Type;
