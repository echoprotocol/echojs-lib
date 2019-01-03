import Type from '../type';

/**
 * @param {Date} date
 * @returns {number}
 */
function getSeconds(date) { return Math.floor(date.getTime() / 1000); }

class TimePointSecType extends Type {

	/** @param {number|Date|string} value */
	validate(value) {
		if (typeof value === 'number') return;
		if (value instanceof Date) return;
		if (typeof value !== 'string') throw new Error('invalid time_point_sec type');
		if (Number.isNaN(getSeconds(value))) throw new Error('invalid time_point_sec format');
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

}

const timePointSec = new TimePointSecType();

export default timePointSec;
