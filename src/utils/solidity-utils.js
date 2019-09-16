import { ok } from 'assert';
import { keccak256 } from 'js-sha3';

/** @typedef {import("../../types/_Abi").AbiMethod} AbiMethod */

/**
 * @param {AbiMethod} abiMethod
 * @returns {string}
 */
export function getSignature(abiMethod) {
	return `${abiMethod.name}(${abiMethod.inputs.map(({ type }) => type).join(',')})`;
}

export function checkIntegerSize(bitsCount) {
	if (typeof bitsCount !== 'number') throw new Error('bits count is not a number');
	if (bitsCount <= 0) throw new Error('bits count is not positive');
	if (bitsCount > 256) throw new Error('bits count is greater than 256');
	if (!Number.isSafeInteger(bitsCount)) throw new Error('bits count is not a integer');
	if (bitsCount % 8 !== 0) throw new Error('bits count is not divisible to 8');
}

export function checkBytesCount(bytesCount) {
	if (typeof bytesCount !== 'number') throw new Error('bytes count is not a number');
	if (bytesCount <= 0) throw new Error('bytes count is not positive');
	if (!Number.isSafeInteger(bytesCount)) throw new Error('bytes count is not a integer');
	if (bytesCount > 32) throw new Error('bytes count is grater than 32');
}

/**
 * @param {AbiMethod} abiMethod
 * @returns {string}
 */
export function getMethodHash(abiMethod) {
	return keccak256(getSignature(abiMethod));
}

/** @param {Array<AbiMethod>} abi */
export function checkAbiFormat(abi) {
	if (!Array.isArray(abi)) throw new Error('abi is not an array');
	for (const abiMethod of abi) {
		// typeof is uncovered. see https://github.com/gotwarlost/istanbul/issues/582
		if (typeof abiMethod !== 'object' || abiMethod === null) throw new Error('abi method is not an object');
		if (abiMethod.type === 'fallback') {
			ok(abiMethod.payable === true && abiMethod.stateMutability === 'payable', 'abi method is not payable');
			ok(abiMethod.inputs === undefined, 'unexpected inputs array of fallback-function');
			ok(abiMethod.outputs === undefined, 'unexpected outputs array of fallback-function');
		} else {
			if (abiMethod.type !== 'constructor' && typeof abiMethod.name !== 'string') {
				throw new Error('abi method name is not a string');
			}
			if (!Array.isArray(abiMethod.inputs)) throw new Error('inputs of abi method is not an array');
			if (abiMethod.type === 'function' && !Array.isArray(abiMethod.outputs)) {
				throw new Error('outputs of abi method is not an array');
			}
		}
	}
}
