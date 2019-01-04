/** @typedef {import('bytebuffer')} ByteBuffer */

function notImplemented() {
	throw new Error('not implemented');
}

/** @abstract */
class Type {

	/**
	 * @abstract
	 * @param {*} value
	 */
	// eslint-disable-next-line no-unused-vars
	validate(value) { notImplemented(); }

	/**
	 * @abstract
	 * @param {*} value
	 * @param {ByteBuffer} bytebuffer
	 */
	// eslint-disable-next-line no-unused-vars
	appendToByteBuffer(value, bytebuffer) { notImplemented(); }

}

export default Type;
