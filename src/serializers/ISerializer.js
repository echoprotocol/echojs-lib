import ByteBuffer from 'bytebuffer';

function notImplementedSerialization() { throw new Error('serialization is not implemented'); }

/**
 * @abstract
 * @template TInput
 * @template TOutput
 */
export default class ISerializer {

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
 * @template {ISerializer} T
 * @typedef {Parameters<T['toRaw']>[0]} SerializerInput
 */

/**
 * @template {ISerializer} T
 * @typedef {ReturnType<T['toRaw']>} SerializerOutput
 */
