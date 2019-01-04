import { box } from 'tweetnacl';

import { isString, isBuffer } from '../utils/validator';

class ED25519 {

	/**
     *  @method publicKeyFromPrivateKey
     *
     *  @param {String|Buffer} pk - 32 byte hex string.
     *
     *  @return {Buffer} ed25519 public key
     */
	static publicKeyFromPrivateKey(pk) {
		if (!(isString(pk) || isBuffer(pk))) {
			throw new Error('private key must be string of buffer');
		}

		if (isString(pk)) pk = Buffer.from(pk, 'hex');

		if (pk.length !== 32) {
			throw new Error(`Expecting 32 bytes, instead got ${pk.length}`);
		}

		return Buffer.from(box.keyPair.fromSecretKey(pk).publicKey);
	}

}

export default ED25519;

