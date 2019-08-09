import * as ed25519 from 'ed25519.js';

import { isString, isBuffer } from '../utils/validators';

class ED25519 {

	/**
	 *  @method keyPairFromPrivateKey
	 *
	 *  @param {String|Buffer} privateKey - 32 byte hex string.
	 *
	 *  @return {{privateKey:Buffer,publicKey:Buffer}} ed25519 privateKey and public key
	 */
	static keyPairFromPrivateKey(privateKey) {
		if (!(isString(privateKey) || isBuffer(privateKey))) {
			throw new Error('private key must be string of buffer');
		}

		if (isString(privateKey)) privateKey = Buffer.from(privateKey, 'hex');

		if (privateKey.length !== 32) {
			throw new Error(`Expecting 32 bytes, instead got ${privateKey.length}`);
		}

		const publicKey = ed25519.derivePublicKey(privateKey);
		return { privateKey, publicKey };
	}

	/**
	 *  @method createKeyPair
	 *
	 *  @return {{privateKey:Buffer,publicKey:Buffer}} ed25519 privateKey and public key
	 */
	static createKeyPair() {
		return ed25519.createKeyPair();
	}

	/**
	 *  @method signMessage
	 *  @param {Buffer} message
	 *  @param {Buffer} publicKey
 	 *  @param {Buffer} privateKey
	 *  @return {{signature:Buffer}}
	 */
	static signMessage(message, publicKey, privateKey) {

		if (!isBuffer(message)) {
			throw new Error('message must be buffer');
		}

		if (!isBuffer(publicKey)) {
			throw new Error('public key must be buffer');
		}

		if (!isBuffer(privateKey)) {
			throw new Error('private key must be buffer');
		}

		return ed25519.sign(message, publicKey, privateKey);
	}

	/**
	 *  @method verifyMessage
	 *  @param {Buffer} signature
	 *  @param {Buffer} message
	 *  @param {Buffer} publicKey
	 *  @return {Boolean}
	 */
	static verifyMessage(signature, message, publicKey) {

		if (!isBuffer(signature)) {
			throw new Error('signature must be buffer');
		}

		if (!isBuffer(message)) {
			throw new Error('message key must be buffer');
		}

		if (!isBuffer(publicKey)) {
			throw new Error('public key must be buffer');
		}

		return ed25519.verify(signature, message, publicKey);
	}

}

export default ED25519;
