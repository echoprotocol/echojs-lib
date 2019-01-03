import { box } from 'tweetnacl';

import { isString, isBuffer } from '../utils/validator';

class ED25519 {

	/**
     *  @method fromPrivateKey
     *
     *  @param {String|Buffer} seed - 32 byte length string.
     *
     *  @return {Buffer} ed25519 public key
     */
	static publicKeyFromSeed(seed) {
		if (!(isString(seed) || isBuffer(seed))) {
			throw new Error('private key must be string of buffer');
		}

		if (isString(seed)) seed = Buffer.from(seed, 'hex');

		if (seed.length !== 32) {
			throw new Error(`Expecting 32 bytes, instead got ${seed.length}`);
		}

		return box.keyPair.fromSecretKey(seed).publicKey;
	}

}

export default ED25519;

