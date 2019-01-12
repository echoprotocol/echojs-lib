import BigNumber from 'bignumber.js';
import Long from 'long';
import { idRegex } from './validators';

const MAX_UINT64 = new BigNumber(2).pow(64).minus(1);
const MAX_INT64 = new BigNumber(2).pow(63).minus(1);

/**
 * @param {BigNumber} bn
 * @param {boolean} unsigned
 */
export function BigNumberToLong(bn, unsigned) {
	if (!BigNumber.isBigNumber(bn)) throw new Error('value is not a BigNumber');
	if (typeof unsigned !== 'boolean') throw new Error('property "unsigned" is not a boolean');
	if (!bn.isInteger()) throw new Error('value is not a integer');
	if (unsigned) {
		if (bn.gt(MAX_UINT64)) throw new Error('uint64 overflow');
		if (bn.lt(0)) throw new Error('value is negative');
	} else if (bn.abs().gt(MAX_INT64)) throw new Error('int64 overflow');
	return Long.fromString(bn.toString(10), unsigned, 10);
}

/**
 * @param {string|number} address
 * @param {number} reservedSpaceId
 * @param {number|Array<number>} objectTypeId
 * @returns {number}
 */
export function toId(address, reservedSpaceId, objectTypeId) {
	if (typeof address === 'number') return address;
	if (typeof address !== 'string') throw new Error('invalid id type');
	if (!idRegex.test(address)) throw new Error('invalid id format');
	// TODO: use BigNumber for id
	const [actualReservedSpaceId, actualObjectTypeId, id] = address.split('.').map((str) => Number.parseInt(str, 10));
	if (actualReservedSpaceId !== reservedSpaceId) throw new Error('invalid reservedSpaceId');
	if (typeof objectTypeId === 'number') {
		if (actualObjectTypeId !== objectTypeId) throw new Error('invalid objectTypeId');
	} else if (!Array.isArray(objectTypeId)) throw new Error('invalid objectTypeId type');
	else if (!objectTypeId.includes(actualObjectTypeId)) throw new Error('invalid objectTypeId');
	return id;
}
