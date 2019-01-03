import { sign } from 'tweetnacl';

import { isString, isBuffer } from '../utils/validator';

class EchorandKey {

	/**
     *  @method fromSeed
     *  This is private, the same seed produces the same private key every time.
     *
     *  @param {String|Buffer} pk - any length string.
     *
     *  @return {Buffer} ed25519 public key
     */
	static fromPrivateKey(pk) {
		if (!(isString(pk) || isBuffer(pk))) {
			throw new Error('private key must be string of buffer');
		}

		if (isString(pk)) pk = Buffer.from(pk, 'hex');

		if (pk.length !== 64) {
			throw new Error(`Expecting 64 bytes, instead got ${pk.length}`);
		}

		return sign.keyPair.fromSecretKey(pk).publicKey;
	}


}

export default EchorandKey; // TODO rename to ed25519 enicoder

