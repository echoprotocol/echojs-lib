import { ArrayType } from './array';
import { validatePositiveSafeInteger } from '../../utils/validators';

class FixedArrayType extends ArrayType {

	/**
	 * @readonly
	 * @type {number}
	 */
	get count() { return this._count; }

	/**
	 * @param {number} count
	 * @param {Type} type
	 */
	constructor(count, type) {
		super(type);
		validatePositiveSafeInteger(count);
		/**
		 * @private
		 * @type {number}
		 */
		this._count = count;
	}

	/** @param {Array<*>} value */
	validate(value) {
		super.validate(value);
		if (value.length !== this.count) throw new Error('invalid array length');
	}

	/**
	 * @param {Array<*>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		super.appendToByteBuffer(value, bytebuffer, false);
	}

	/**
	 * @param {Array<*>} value
	 * @returns {Array<*>}
	 */
	toObject(value) {
		this.validate(value);
		return value.map((element) => this.type.validate(element));
	}

}

/**
 * @param {number} count
 * @param {Type} type
 * @returns {FixedArrayType}
 */
export default (count, type) => new FixedArrayType(count, type);