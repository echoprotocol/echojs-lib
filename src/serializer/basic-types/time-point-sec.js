import Type from '../type';
import { validateUnsignedSafeInteger } from '../../utils/validators';

/**
 * @param {Date} date
 * @returns {number}
 */
function getSeconds(date) { return Math.floor(date.getTime() / 1000); }

class TimePointSecType extends Type {

	/**
	 * @param {number|Date|string} value
	 * @returns {Date}
	 */
	validate(value) {
		if (typeof value === 'number') {
			validateUnsignedSafeInteger(value);
			value *= 1000;
			validateUnsignedSafeInteger(value);
			return new Date(value);
		}
		if (value instanceof Date) return value;
		if (typeof value !== 'string') throw new Error('invalid time_point_sec type');
		value = new Date(value);
		const time = value.getTime();
		if (Number.isNaN(time)) throw new Error('invalid time_point_sec format');
		return value;
	}

	/**
	 * @param {number|Date|string} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		if (value instanceof Date) value = Math.floor(value.getTime() / 1000);
		if (typeof value === 'string') value = getSeconds(new Date(value));
		bytebuffer.writeUint32(value);
	}

	/**
	 * @param {number|Date|string} value
	 * @returns {string}
	 */
	toObject(value) { return this.validate(value).toISOString().split('.')[0]; }

}

export default new TimePointSecType();
