import ByteBuffer from 'bytebuffer';

/** @typedef {import('bytebuffer')} ByteBuffer */

function notImplementedSerialization() {
	throw new Error('serialization is not implemented');
}

/** @abstract */
class Type {

	// FIXME: go through all composite types and rewrite validators so that subtypes are not validated twice

	/**
	 * @abstract
	 * @param {*} value
	 */
	// eslint-disable-next-line no-unused-vars
	validate(value, feeIsRequired = true) { notImplementedSerialization(); }

	/**
	 * @abstract
	 * @param {*} value
	 * @param {ByteBuffer} bytebuffer
	 */
	// eslint-disable-next-line no-unused-vars
	appendToByteBuffer(value, bytebuffer) { notImplementedSerialization(); }

	/**
	 * @abstract
	 * @param {*} value
	 * @returns {*}
	 */
	// eslint-disable-next-line no-unused-vars
	toObject(value) { notImplementedSerialization(); }

}

/**
 * @param {Type} type
 * @param {*} value
 * @returns {Buffer}
 */
function toBuffer(type, value) {
	const result = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
	type.appendToByteBuffer(value, result);
	return result.copy(0, result.offset).toBuffer();
}

export default Type;
export { toBuffer };
