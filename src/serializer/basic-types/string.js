import Type from '../type';

class StringType extends Type {

	/**
	 * @param {string|Buffer} value
	 * @returns {string}
	 */
	validate(value) {
		if (typeof value === 'string') return value;
		if (Buffer.isBuffer(value)) return value.toString('binary');
		throw new Error('value is not a string');
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

	/**
	 * @param {string} value
	 * @returns {string}
	 */
	toObject(value) { return this.validate(value); }

}

export default new StringType();
