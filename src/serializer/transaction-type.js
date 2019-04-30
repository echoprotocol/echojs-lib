import serializable from './serializable';
import { uint16, uint32, timePointSec, array, empty, set, bytes } from './basic-types';
import { operationWrapper } from './composit-types';

const transaction = serializable({
	ref_block_num: uint16,
	ref_block_prefix: uint32,
	expiration: timePointSec,
	operations: array(operationWrapper),
	extensions: set(empty),
});

// TODO: fix properties types in JSDoc
/**
 * @typedef {Object} SignedTransactionObject
 * @property {*} ref_block_num
 * @property {*} ref_block_prefix
 * @property {*} expiration
 * @property {*} operations
 * @property {*} extensions
 * @property {*} signatures
 */

export const signedTransaction = serializable({
	ref_block_num: uint16,
	ref_block_prefix: uint32,
	expiration: timePointSec,
	operations: array(operationWrapper),
	extensions: set(empty),
	signatures: array(bytes(64)),
});

export default transaction;
