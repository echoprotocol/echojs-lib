import BigNumber from 'bignumber.js';
import ISerializer from '../../ISerializer';

/** @typedef {number | BigNumber | string} TInput */

/**
 * @abstract
 * @template {string | number} TOutput
 * @augments {ISerializer<TInput, TOutput>}
 */
export default class IIntSerializer extends ISerializer {

	/**
	 * @readonly
	 * @type {number}
	 */
	get bitsCount() { return this._bitsCount; }

	/**
	 * @readonly
	 * @type {BigNumber}
	 */
	get maxAbsValue() { return this._maxAbsValue; }

	get isUint() { return this._isUint; }

	/**
	 * @param {number} bitsCount
	 * @param {boolean} [isUint]
	 */
	constructor(bitsCount, isUint = false) {
		super();
		if (!Number.isSafeInteger(bitsCount) || bitsCount < 0) {
			throw new Error('bits count is not unsigned safe integer');
		}
		if (bitsCount % 8 !== 0) throw new Error('invalid bits count');
		if (bitsCount === 0) throw new Error('bits');
		/** @private */
		this._bitsCount = bitsCount;
		/**
		 * @private
		 * @type {boolean}
		 */
		this._isUint = isUint;
		/** @private */
		this._maxAbsValue = new BigNumber(2).pow(bitsCount - (this.isUint ? 0 : 1)).minus(1);
	}

	/**
	 * @param {TInput} value
	 * @returns {TOutput}
	 */
	toRaw(value) {
		if (typeof value === 'number') {
			if (Math.abs(value) > Number.MAX_SAFE_INTEGER) throw new Error('loss of accuracy, use bignumber.js');
			value = new BigNumber(value);
		} else if (typeof value === 'string') value = new BigNumber(value);
		if (!BigNumber.isBigNumber(value)) throw new Error('value is not a number');
		if (!value.isInteger()) throw new Error('value is not a integer');
		if (value.abs().gt(this._maxAbsValue)) throw new Error(`int${this._bitsCount} overflow`);
		return this.bitsCount < 53 ? value.toNumber() : value.toString();
	}

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: TOutput, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		const bytesCount = this.bitsCount / 8;
		const newOffset = offset + bytesCount;
		if (buffer.length < newOffset) throw new Error('unexpected buffer end');
		const bytes = [...buffer.slice(offset, newOffset)];
		let result = new BigNumber(0);
		const isNegative = this.isUint ? false : bytes[bytesCount - 1];
		let multiplier = new BigNumber(1);
		for (const byte of bytes) {
			result = result.plus(new BigNumber(isNegative ? 0xff - byte : byte).times(multiplier));
			multiplier = multiplier.times(2 ** 8);
		}
		if (isNegative) result = result.plus(1).times(-1);
		return { res: this.toRaw(result), newOffset };
	}

}
