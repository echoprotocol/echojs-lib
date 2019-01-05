import Type from '../type';

class BoolType extends Type {

	/** @param {boolean} value */
	validate(value) { return typeof value === 'boolean'; }

	/**
	 * @param {boolean} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		bytebuffer.writeUint8(value ? 1 : 0);
	}

}

export default new BoolType();
