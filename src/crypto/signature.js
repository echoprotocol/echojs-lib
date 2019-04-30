import * as ed25519 from 'ed25519.js';

import { sha256 } from './hash';

/** @typedef {import('./private-key').default} PrivateKey */


export default class Signature {

	/**
	 * @param {Buffer} signature
	 */
	constructor(signature) {
		this.signat = signature;
	}

	/**
	 * @static
	 * @param {Buffer} hash
	 * @param {PrivateKey} privateKey
	 */
	static signBufferSha256(hash, privateKey) {
		if (!Buffer.isBuffer(hash)) throw new Error('invalid hash type');
		if (hash.length !== 32) throw new Error('invalid sha256 hash length');
		const signat = ed25519.sign(hash, privateKey.toPublicKey().toBuffer(), privateKey.toBuffer());
		return new Signature(signat);
	}

	/**
	 * @static
	 * @param {Buffer} buffer
	 * @param {PrivateKey} privateKey
	 */
	static signBuffer(buffer, privateKey) {
		const hash = sha256(buffer);
		return Signature.signBufferSha256(hash, privateKey);
	}

	/** @returns {Buffer} */
	toBuffer() {
		return this.signat;
	}

}
