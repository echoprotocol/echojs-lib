import Type from '../type';

class BoolType extends Type {

	/**
	 * @param {boolean|string|number} value
	 * @returns {boolean}
	 */
	validate(value) {
		if (typeof value === 'boolean') return value;
		if (typeof value === 'string') {
			if (['true', '1'].includes(value)) return true;
			if (['false', '0'].includes(value)) return false;
			throw new Error('invalid bool-string');
		}
		if (typeof value === 'number') {
			if (value === 1) return true;
			if (value === 0) return false;
			throw new Error('invalid bool-number');
		}
		throw new Error('invalid bool value type');
	}

	/**
	 * @param {boolean} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		bytebuffer.writeUint8(value ? 1 : 0);
	}

	/**
	 * @param {boolean|string|number} value
	 * @returns {boolean}
	 */
	toObject(value) { return this.validate(value); }

}

export default new BoolType();
