/* eslint-disable no-bitwise */
const ed25519 = require('ed25519.js');
const { sha256 } = require('./hash');


class Signature {

	constructor(signature) {
		this.signat = signature;
	}

	toBuffer() {
		return this.signat;
	}

	/**
		@param {Buffer} buf
		@param {PrivateKey} privateKey
		@return {Signature}
	*/
	static signBuffer(buf, privateKey) {
		const _hash = sha256(buf);
		return Signature.signBufferSha256(_hash, privateKey);
	}

	/** Sign a buffer of exactally 32 bytes in size (sha256(text))
		@param {Buffer} buf - 32 bytes binary
		@param {PrivateKey} privateKey
		@return {Signature}
	*/
	static signBufferSha256(hash, privateKey) {
		if (!Buffer.isBuffer(hash)) throw new Error('invalid hash type');
		if (hash.length !== 32) throw new Error('invalid sha256 hash length');

		const signat = ed25519.sign(hash, privateKey.toPublicKey().toBuffer(), privateKey.toBuffer());

		return new Signature(signat);
	}

	static sign(string, privateKey) {
		return Signature.signBuffer(Buffer.from(string), privateKey);
	}

}

module.exports = Signature;
