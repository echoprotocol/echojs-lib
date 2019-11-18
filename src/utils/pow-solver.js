import { sha256 } from '../crypto/hash';
import { uint64 } from '../serializers/basic/integers';

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

async function asyncCounter() {
	const numberTo = 10;
	for (let i = 0; i < numberTo; i += 1) {
		// eslint-disable-next-line no-await-in-loop
		await new Promise((resolve) => setTimeout(() => resolve(), 1e3));
	}
}

/* eslint-disable import/prefer-default-export */
/**
 *
 * @param {String} blockId
 * @param {String} randNum
 * @param {Number} difficulty
 */
export const solveRegistrationTask = async (blockId, randNum, difficulty) => {
	async function getNonce() {
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
			if (it % 1e6 === 0) await new Promise((resolve) => setTimeout(() => resolve(), 100));
			if (hashPow > difficulty) {
				return nonce;
			}
			nonce += 1;
		}
	}

	const valueOfNonce = getNonce();
	await asyncCounter();

	// eslint-disable-next-line no-return-await
	return await valueOfNonce;
};

