import Type from '../type';

class OptionalType extends Type {

	/**
	 * @readonly
	 * @type {Type}
	 */
	get type() { return this._type; }

	/** @param {Type} type */
	constructor(type) {
		super();
		if (!(type instanceof Type)) throw new Error('property "type" is not a instance of Type class');
		/**
		 * @private
		 * @type {Type}
		 */
		this._type = type;
	}

	validate(value) {
		if (value === undefined) return;
		this.type.validate(value);
	}

	/**
	 * @param {*} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		bytebuffer.writeUint8(value === undefined ? 0 : 1);
		if (value !== undefined) this.type.appendToByteBuffer(value, bytebuffer);
	}

}

/**
 * @param {Type} type
 * @returns {OptionalType}
 */
export default (type) => new OptionalType(type);
