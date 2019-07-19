const BigInteger = require('bigi');
const { encode, decode } = require('bs58');
const deepEqual = require('deep-equal');
const assert = require('assert');
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
		const privateWIF = Buffer.from(decode(_privateWIF));
		const version = privateWIF.readUInt8(0);
		assert.equal(0x80, version, `Expected version ${0x80}, instead got ${version}`);
		// checksum includes the version
		let privateKey = privateWIF.slice(0, -4);
		const checksum = privateWIF.slice(-4);
		let newChecksum = sha256(privateKey);
		newChecksum = sha256(newChecksum);
		newChecksum = newChecksum.slice(0, 4);
		const isEqual = deepEqual(checksum, newChecksum); //	, 'Invalid checksum'
		if (!isEqual) {
			throw new Error('Checksum did not match');
		}
		privateKey = privateKey.slice(1);
		return PrivateKey.fromBuffer(privateKey);
	}

	toWif() {
		let privateKey = this.toBuffer();
		// checksum includes the version
		privateKey = Buffer.concat([Buffer.from([0x80]), privateKey]);
		let checksum = sha256(privateKey);
		checksum = sha256(checksum);
		checksum = checksum.slice(0, 4);
		const privateWIF = Buffer.concat([privateKey, checksum]);
		return encode(privateWIF);
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
