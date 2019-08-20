import Type from '../type';

class Default extends Type {

	/**
	 * @param {Type} type
	 * @param {any} defaultValue
	 */
	constructor(type, defaultValue) {
		super();
		if (!(type instanceof Type)) throw new Error('property "type" is not a instance of Type class');
		/**
		 * @private
		 * @type {Type}
		 */
		this._type = type;
		this._type.validate(defaultValue);
		/** @private */
		this._defaultValue = defaultValue;
	}

	/**
	 * @param {any} value
	 * @returns {any}
	 */
	validate(value) {
		try {
			return this._type.validate(value === undefined ? this._defaultValue : value);
		} catch (err) {
			if (value !== undefined) throw err;
			throw new Error(`default value: ${err.message}`);
		}
	}

	/**
	 * @param {any} value
	 * @param {ByteBuffer} bytebuffer
	 * @returns {void}
	 */
	appendToByteBuffer(value, bytebuffer) {
		this._type.appendToByteBuffer(value === undefined ? this._defaultValue : value, bytebuffer);
	}

	/**
	 * @param {any} value
	 * @returns {any}
	 */
	toObject(value) { return this._type.toObject(value === undefined ? this._defaultValue : value); }

}

/**
 * @param {Type} type
 * @param {any} defaultValue
 * @returns {Default}
 */
export default (type, defaultValue) => new Default(type, defaultValue);
