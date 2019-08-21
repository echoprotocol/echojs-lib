import ByteBuffer from 'bytebuffer';

/** @typedef {import('bytebuffer')} ByteBuffer */

function notImplementedSerialization() {
	throw new Error('serialization is not implemented');
}

/**
 * @abstract
 * @template TInput
 * @template TOutput
 */
export default class Serializable {

	/**
	 * @abstract
	 * @param {TInput} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer() { notImplementedSerialization(); }

	/**
	 * @abstract
	 * @param {TInput} value
	 * @returns {TOutput}
	 */
	toRaw() { notImplementedSerialization(); }

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
