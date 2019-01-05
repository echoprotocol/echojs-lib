import Type from '../type';

class StringType extends Type {

	/** @param {string|Buffer} value */
	validate(value) {
		if (typeof value !== 'string' || !Buffer.isBuffer(value)) throw new Error('value is not a string');
	}

	/**
	 * @param {string|Buffer} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		bytebuffer.writeVarint32(value.length);
		bytebuffer.append(value.toString('binary'), 'binary');
	}

}

export default new StringType();
