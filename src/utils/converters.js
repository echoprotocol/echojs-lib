import { Long } from 'bytebuffer';
import BigNumber from 'bignumber.js';
import { idRegex } from './validators';
import { collections, chain, basic } from '../serializers';

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

/** @typedef {string | number | BigNumber} ObjectId_t */
/** @typedef {number | BigNumber | string} Integer_t */
/**
 * @template T
 * @typedef {Set<T> | T[] | undefined} Set_t
 */

/**
 * @typedef {Object} ContractLogsFilterOptions_t
 * @property {Set_t<ObjectId_t>} [contracts]
 * @property {Array<Set_t<string>>} [topics]
 * @property {Integer_t} [fromBlock]
 * @property {Integer_t} [toBlock]
 */

/**
 * @typedef {Object} ContractLogsFilterOptionsRaw
 * @property {string[]} [contracts]
 * @property {Array<string[]>} [topics]
 * @property {number} [from_block]
 * @property {number} [to_block]
 */

/**
 * @param {ContractLogsFilterOptions_t} opts
 * @returns {ContractLogsFilterOptionsRaw}
 */
export function toRawContractLogsFilterOptions(opts) {
	/** @type {string[]} */
	const contractsList = opts.contracts === undefined ? undefined :
		collections.set(chain.ids.protocol.contractId).toRaw(opts.contracts, 'contracts');
	/** @type {Array<string[]>} */
	const topicsList = opts.topics === undefined ? undefined :
		collections.vector(collections.set(basic.string)).toRaw(opts.topics, '`topics`');
	const from = opts.fromBlock === undefined ? undefined : basic.integers.int32.toRaw(opts.fromBlock, 'fromBlock');
	const to = opts.toBlock === undefined ? undefined : basic.integers.int32.toRaw(opts.toBlock, 'toBlock');
	if (from !== undefined && from < 0) throw new Error('`fromBlock` must be greater than or equal to zero');
	if (to !== undefined && to <= 0) throw new Error('`toBlock` must be greater than zero');
	return {
		contracts: contractsList,
		topics: topicsList,
		from_block: from,
		to_block: to,
	};
}
