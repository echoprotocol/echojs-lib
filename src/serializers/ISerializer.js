import ByteBuffer from 'bytebuffer';

function notImplementedSerialization() { throw new Error('serialization is not implemented'); }

/**
 * @abstract
 * @class
 * @name ISerializer
 * @template TInput
 * @template TOutput
 */
export default class ISerializer {

	constructor() {
		/**
		 * @abstract
		 * @type {TInput}
		 */
		this.__TInput__ = undefined;
		/**
		 * @abstract
		 * @type {TOutput}
		 */
		this.__TOutput__ = undefined;
	}

	/**
	 * @abstract
	 * @param {TInput} value
	 * @param {ByteBuffer} bytebuffer
	 */
	// eslint-disable-next-line no-unused-vars
	appendToByteBuffer(value, bytebuffer) { notImplementedSerialization(); }

	/**
	 * @abstract
	 * @param {TInput} value
	 * @returns {TOutput}
	 */
	// eslint-disable-next-line no-unused-vars
	toRaw(value) { notImplementedSerialization(); }

	/** @param {TInput} value */
	validate(value) { this.toRaw(value); }

	/**
	 * @param {TInput} value
	 * @returns {Buffer}
	 */
	serialize(value) {
		const result = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
		this.appendToByteBuffer(value, result);
		return result.copy(0, result.offset).toBuffer();
	}

}

/**
 * @property {string} Qwe
 * @memberof ISerializer
 */

/**
 * @template {ISerializer} T
 * @typedef {T['__TInput__']} SerializerInput
 */

/**
 * @template {ISerializer} T
 * @typedef {T['__TOutput__']} SerializerOutput
 */
