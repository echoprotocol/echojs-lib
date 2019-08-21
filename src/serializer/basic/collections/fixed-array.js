import { ArrayType } from './array';
import { validatePositiveSafeInteger } from '../../../utils/validators';

/** @typedef {import("../../serializable").default} Serializable */

/**
 * @template {Serializable} T
 * @augments {ArrayType<T>}
 */
class FixedArrayType extends ArrayType {

	/**
	 * @readonly
	 * @type {number}
	 */
	get length() { return this._length; }

	/**
	 * @param {number} length
	 * @param {T} type
	 */
	constructor(length, type) {
		super(type);
		validatePositiveSafeInteger(length);
		/**
		 * @private
		 * @type {number}
		 */
		this._length = length;
	}

	/**
	 * @param {Parameters<ArrayType<T>['toRaw']>[0]} value
	 * @returns {ReturnType<ArrayType<T>['toRaw']>}
	 */
	toRaw(value) {
		if (value.length !== this.length) throw new Error('invalid array length');
		return super.toRaw(value);
	}

	/**
	 * @param {Parameters<ArrayType<T>['toRaw']>[0]} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		super.appendToByteBuffer(raw, bytebuffer, false);
	}

}

/**
 * @template {Serializable} T
 * @param {number} length
 * @param {T} type
 * @returns {FixedArrayType<T>}
 */
export default function fixedArray(length, type) { return new FixedArrayType(length, type); }
