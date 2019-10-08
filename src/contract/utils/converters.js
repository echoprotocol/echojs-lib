import BigNumber from 'bignumber.js';

/**
 * @param {number|string|BigNumber} value
 * @returns {BigNumber}
 */
export function toBigInteger(value) {
	if (typeof value === 'number') {
		if (value > Number.MAX_SAFE_INTEGER) throw new Error('loss of accuracy, use bignumber.js');
		value = new BigNumber(value);
	} else if (typeof value === 'string') {
		value = new BigNumber(value);
		if (!value.isFinite()) throw new Error('fail to convert string to BigNumber');
	}
	if (!BigNumber.isBigNumber(value)) throw new Error('value is not a number');
	if (!value.isInteger()) throw new Error('value is not a integer');
	return value;
}

/**
 * @param {number} power
 * @returns {BigNumber}
 */
export function toTwosPower(power) { return new BigNumber(2).pow(power); }
