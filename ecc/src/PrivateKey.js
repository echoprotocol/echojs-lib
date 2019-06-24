const BigInteger = require('bigi');
const { encode, decode } = require('bs58');
const ed25519 = require('ed25519.js');
const { sha256 } = require('./hash');
const PublicKey = require('./PublicKey');

class PrivateKey {

	/**
		@private see static functions
		@param {BigInteger}
	*/
	constructor(d) {
		this.d = d;
	}

	static fromBuffer(buf) {
		if (!Buffer.isBuffer(buf)) {
			throw new Error('Expecting paramter to be a Buffer type');
		}
		if (buf.length !== 32) {
			// console.log(
			// 	`WARN: Expecting 32 bytes, instead got ${buf.length}, stack trace:`,
			// 	new Error().stack,
			// );
			throw new Error(`Expecting 32 bytes, instead got ${buf.length}`);
		}
		if (buf.length === 0) {
			throw new Error('Empty buffer');
		}
		return new PrivateKey(BigInteger.fromBuffer(buf));
	}

	/**
	 *  @method fromSeed
	 *  @param {string} seed - any length string.
	 *  This is private, the same seed produces the same private key every time.
	 *  @return {PrivateKey}
	 */
	static fromSeed(seed) { // generate_private_key
		if (!(typeof seed === 'string')) {
			throw new Error('seed must be of type string');
		}
		return PrivateKey.fromBuffer(sha256(seed));
	}

	/** @return {string} Wallet const Format (still a secret, Not encrypted) */
	static fromWif(_privateWIF) {
		return PrivateKey.fromBuffer(decode(_privateWIF));
	}

	toWif() {
		return encode(this.toBuffer());
	}

	toPublicKey() {
		if (this.public_key) {
			return this.public_key;
		}

		const publicKey = ed25519.derivePublicKey(this.toBuffer());

		this.public_key = PublicKey.fromBuffer(publicKey);

		return this.public_key;
	}

	toBuffer() {
		return this.d.toBuffer(32);
	}

	static fromHex(hex) {
		return PrivateKey.fromBuffer(Buffer.from(hex, 'hex'));
	}

	toHex() {
		return this.toBuffer().toString('hex');
	}

	getSharedSecret() {
		throw new Error('Need to implement');
	}


	/* </helper_functions> */

}

module.exports = PrivateKey;
