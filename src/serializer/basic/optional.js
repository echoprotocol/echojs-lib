import Serializable from '../serializable';

// TODO: jsdoc
class OptionalType extends Serializable {

	/**
	 * @readonly
	 * @type {Type}
	 */
	get type() { return this._type; }

	/** @param {Type} type */
	constructor(type) {
		super();
		if (!(type instanceof Serializable)) throw new Error('property "type" is not a instance of Type class');
		/**
		 * @private
		 * @type {Type}
		 */
		this._type = type;
	}

	validate(value) {
		if (value === undefined) return;
		try {
			this.type.validate(value);
		} catch (error) {
			throw new Error(`optional type: ${error.message}`);
		}
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

	/**
	 * @param {undefined|*} value
	 * @returns {undefined|*}
	 */
	toObject(value) { return value === undefined ? undefined : this.type.toObject(value); }

}

/**
 * @param {Type} type
 * @returns {OptionalType}
 */
export default (type) => new OptionalType(type);
