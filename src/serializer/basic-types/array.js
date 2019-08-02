import Type from '../type';

class ArrayType extends Type {

	/**
	 * @readonly
	 * @type {Type}
	 */
	get type() { return this._type; }

	/** @param {Type} type */
	constructor(type) {
		super();
		if (!(type instanceof Type)) throw new Error('invalid array type');
		/**
		 * @private
		 * @type {Type}
		 */
		this._type = type;
	}

	/** @param {Array<*>} value */
	validate(value) {
		if (!Array.isArray(value)) throw new Error('value is not an array');
		for (let i = 0; i < value.length; i += 1) {
			try {
				const element = value[i];
				this.type.validate(element);
			} catch (error) {
				throw new Error(`array element with index ${i}: ${error.message}`);
			}
		}
	}

	/**
	 * @param {Array<*>} value
	 * @param {ByteBuffer} bytebuffer
	 * @param {boolean} writeLength
	 */
	appendToByteBuffer(value, bytebuffer, writeLength = true) {
		if (typeof writeLength !== 'boolean') throw new Error('property "writeLength" is not a boolean');
		this.validate(value);
		// TODO: sortOperation
		if (writeLength) bytebuffer.writeVarint32(value.length);
		for (const element of value) this.type.appendToByteBuffer(element, bytebuffer);
	}

	/**
	 * @param {Array<*>} value
	 * @returns {Array<*>}
	 */
	toObject(value) {
		this.validate(value);
		return value.map((element) => this.type.toObject(element));
	}

}

/**
 * @param {Type} type
 * @returns {ArrayType}
 */
export default (type) => new ArrayType(type);
export { ArrayType };
