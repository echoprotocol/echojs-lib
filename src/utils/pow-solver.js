import ByteBuffer from 'bytebuffer';

import { sha256 } from '../crypto/hash';
import { uint64 } from '../serializers/basic/integers';

/* eslint-disable import/prefer-default-export */
/**
 *
 * @param {String} blockId
 * @param {String} randNum
 * @param {Number} difficulty
 */
export const solveRegistrationTask = async (blockId, randNum, difficulty) => {

	const buffer = ByteBuffer.concat([
		ByteBuffer.fromHex(blockId),
		uint64.serialize(randNum),
	]);

	for (let i = 0; i < Number.MAX_SAFE_INTEGER; i += 1) {
		const bufferToHash = ByteBuffer.concat([buffer, uint64.serialize(i)]);
		const hash1 = sha256(bufferToHash.toBuffer());

		let solPow = 0;
		for (let index = 0; index < 32; index += 1) {
			const byte = hash1[index];
			if (byte === 0) {
				solPow += 8;
				continue;
			}
			let devider = 128; // 1 << 7;
			while (byte < devider) {
				solPow += 1;
				devider /= 2; // devider >> 1
			}
			break;
		}

		if (solPow > difficulty) {
			return i;
		}

	}

	throw new Error(`registration solution hasn't been reached on nonce range: [0, ${Number.MAX_SAFE_INTEGER}].`);
};
