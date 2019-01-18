import BigNumber from 'bignumber.js';

import Type from '../../type';

/** @abstract */
class UintType extends Type {

	/** @param {number} bitsCount */
	constructor(bitsCount) {
		super();
		/** @private */
		this._bitsCount = bitsCount;
		/** @private */
		this._maxValue = new BigNumber(2).pow(bitsCount).minus(1);
	}

	/**
	 * @param {number|string|BigNumber} value
	 * @returns {BigNumber}
	 */
	validate(value) {
		if (typeof value === 'number') {
			if (value > Number.MAX_SAFE_INTEGER) throw new Error('loss of accuracy, use bignumber.js');
			value = new BigNumber(value);
		} else if (typeof value === 'string') value = new BigNumber(value);
		if (!BigNumber.isBigNumber(value)) throw new Error('value is not a number');
		if (!value.isInteger()) throw new Error('value is not a integer');
		if (value.lt(0)) throw new Error('value is negative');
		if (value.gt(this._maxValue)) throw new Error(`uint${this._bitsCount} overflow`);
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

export default UintType;
