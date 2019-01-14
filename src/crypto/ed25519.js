import { box } from 'tweetnacl';

import { isString, isBuffer } from '../utils/validator';

class ED25519 {

	/**
     *  @method publicKeyFromPrivateKey
     *
     *  @param {String|Buffer} seed - 32 byte hex string.
     *
     *  @return {{privateKey:Buffer,publicKey:Buffer}} ed25519 privateKey and public key
     */
	static keyPairFromSeed(seed) {
		if (!(isString(seed) || isBuffer(seed))) {
			throw new Error('private key must be string of buffer');
		}

		if (isString(seed)) seed = Buffer.from(seed, 'hex');

		if (seed.length !== 32) {
			throw new Error(`Expecting 32 bytes, instead got ${seed.length}`);
		}

		return box.keyPair.fromSecretKey(seed);
	}

}

export default ED25519;

