import ByteBuffer from 'bytebuffer';

function notImplementedSerialization() { throw new Error('serialization is not implemented'); }

/**
 * @abstract
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

	/**
	 * @abstract
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: TOutput, newOffset: number }}
	 */
	// eslint-disable-next-line no-unused-vars
	readFromBuffer(buffer, offset) { notImplementedSerialization(); }

	/** @param {TInput} value */
	validate(value) { this.toRaw(value); }

	/**
	 * @param {TInput} value
	 * @returns {Buffer}
	 */
	serialize(value) {
		const result = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
		this.appendToByteBuffer(value, result);
		const buffer = result.copy(0, result.offset).toBuffer();
		return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
	}

	/**
	 * @param {Buffer} buffer
	 * @returns {TOutput}
	 */
	deserialize(buffer) {
		if (!Buffer.isBuffer(buffer)) throw new Error('invalid buffer type');
		const { res, newOffset } = this.readFromBuffer(buffer);
		if (newOffset !== buffer.length) throw new Error('excess info in the end of the buffer');
		return res;
	}

}

/**
 * @template {ISerializer} T
 * @typedef {T['__TInput__']} SerializerInput
 */

/**
 * @template {ISerializer} T
 * @typedef {T['__TOutput__']} SerializerOutput
 */
