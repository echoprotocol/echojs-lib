import { ok } from 'assert';
import { sha256 } from '../crypto/hash';
import { uint64 } from '../serializers/basic/integers';

/** @typedef {import("../echo").RegistrationOptions} RegistrationOptions */

const getHashPow = (hash) => {
	let solPow = 0;
	for (let index = 0; index < 32; index += 1) {
		const byte = hash[index];
		if (byte === 0) {
			solPow += 8;
			continue;
		}
		/* eslint-disable no-bitwise */
		let divider = 1 << 7;
		while (byte < divider) {
			solPow += 1;
			/* eslint-disable no-bitwise */
			divider >>= 1;
		}
		break;
	}
	return solPow;
};

/**
 * @param {RegistrationOptions} options
 * @returns {Required<RegistrationOptions>}
 */
export function validateRegistrationOptions(options) {
	if (options.batch !== undefined) {
		ok(typeof options.batch === 'number');
		ok(Number.isSafeInteger(options.batch));
		ok(options.batch >= 0);
	}
	if (options.timeout) {
		ok(typeof options.timeout === 'number');
		ok(Number.isSafeInteger(options.timeout));
		ok(options.timeout >= 0);
	}
	const batch = options.batch === undefined ? 1e6 : options.batch;
	const timeout = options.timeout === undefined ? 100 : options.timeout;
	return { batch, timeout };
}

/**
 *
 * @param {String} blockId
 * @param {String} randNum
 * @param {Number} difficulty
 * @param {RegistrationOptions} [options]
 */
export const solveRegistrationTask = async (blockId, randNum, difficulty, options = {}) => {
	const { batch, timeout } = validateRegistrationOptions(options);
	const buffer = Buffer.concat([
		Buffer.from(blockId, 'hex'),
		uint64.serialize(randNum),
	]);
	let nonce = 0;
	while (true) {
		const bufferToHash = Buffer.concat([buffer, uint64.serialize(nonce)]);
		const hash = sha256(bufferToHash);
		const hashPow = getHashPow(hash);
		// eslint-disable-next-line no-await-in-loop
		if (batch !== 0 && nonce % batch === 0) await new Promise((resolve) => setTimeout(() => resolve(), timeout));
		if (hashPow > difficulty) {
			return nonce;
		}
		nonce += 1;
	}
};

