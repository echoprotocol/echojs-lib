import BigNumber from 'bignumber.js';
import Type from '../../type';

/** @abstract */
class IntType extends Type {

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

	/** @param {number} bitsCount */
	constructor(bitsCount) {
		super();
		/** @private */
		this._bitsCount = bitsCount;
		/** @private */
		this._maxAbsValue = new BigNumber(2).pow(bitsCount - 1).minus(1);
	}

	/**
	 * @param {number|string|BigNumber} value
	 * @returns {BigNumber}
	 */
	validate(value) {
		if (typeof value === 'number') {
			if (Math.abs(value) > Number.MAX_SAFE_INTEGER) throw new Error('loss of accuracy, use bignumber.js');
			value = new BigNumber(value);
		} else if (typeof value === 'string') value = new BigNumber(value);
		if (!BigNumber.isBigNumber(value)) throw new Error('value is not a number');
		if (!value.isInteger()) throw new Error('value is not a integer');
		if (value.abs().gt(this._maxAbsValue)) throw new Error(`int${this._bitsCount} overflow`);
		return value;
	}

	/**
	 * @virtual
	 * @param {number|string|BigNumber} value
	 * @returns {number}
	 */
	toObject(value) {
		return this.validate(value).toNumber();
	}

}

export default IntType;
