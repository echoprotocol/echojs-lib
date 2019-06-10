import BigInteger from 'bigi';
import { encode, decode } from 'bs58';
import deepEqual from 'deep-equal';
import assert from 'assert';
import * as ed25519 from 'ed25519.js';

import { sha256 } from './hash';
import PublicKey from './public-key';

class PrivateKey {

	/**
	 *  @constructor
	 *
	 *  @param {BigInteger} d
	 */
	constructor(d) {
		this.d = d;
	}

	/**
	 *  @method fromBuffer
	 *
	 *  @param  {Buffer} buf
	 *
	 *  @return {PrivateKey}
	 */
	static fromBuffer(buf) {
		if (!Buffer.isBuffer(buf)) {
			throw new Error('Expecting paramter to be a Buffer type');
		}

		if (buf.length !== 32) {
			throw new Error(`Expecting 32 bytes, instead got ${buf.length}`);
		}

		if (buf.length === 0) {
			throw new Error('Empty buffer');
		}

		return new PrivateKey(BigInteger.fromBuffer(buf));
	}

	/**
	 *  @method fromSeed
	 *  This is private, the same seed produces the same private key every time.
	 *
	 *  @param {String} seed - any length string.
	 *
	 *   @return {PrivateKey}
	 */
	static fromSeed(seed) {
		if (!(typeof seed === 'string')) {
			throw new Error('seed must be of type string');
		}

		return PrivateKey.fromBuffer(sha256(seed));
	}

	/**
	 *  @method fromWif
	 *
	 *  @param  {String} _privateWIF
	 *
	 *  @return {PrivateKey}
	 */
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

	/**
	 *  @method toWif
	 *
	 *  @return {String}
	 */
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

	/**
	 *  @method toPublicKey
	 *
	 *  @return {PublicKey}
	 */
	toPublicKey() {

		if (this.public_key) {
			return this.public_key;
		}

		const publicKey = ed25519.derivePublicKey(this.toBuffer());

		this.public_key = PublicKey.fromBuffer(publicKey);

		return this.public_key;
	}

	/**
	 *  @method toBuffer
	 *
	 *  @return {Buffer}
	 */
	toBuffer() {
		return this.d.toBuffer(32);
	}


	/** ECIES */
	/**
	 *  @method getSharedSecret
	 *
	 *  @return {Buffer}
	 */
	getSharedSecret() {
		throw new Error('Need to implement');
	}

	/**
	 *  @method fromHex
	 *
	 *  @param  {String} hex
	 *
	 *  @return {PrivateKey}
	 */
	static fromHex(hex) {
		return PrivateKey.fromBuffer(Buffer.from(hex, 'hex'));
	}

	/**
	 *  @method toHex
	 *
	 *  @return {String}
	 */
	toHex() {
		return this.toBuffer().toString('hex');
	}

	/**
	 *  @method toPrivateKeyString
	 *  Full public key
	 *
	 *
	 *  @return {String}
	 */
	toPrivateKeyString() {
		const buf = this.toBuffer();
		return encode(buf);
	}

	/**
	 *  @method fromPublicKeyString
	 *
	 *  @param  {String} privateKeyString
	 *
	 *  @return {PrivateKey|null} (if the private string is invalid)
	 */
	static fromPrivateKeyString(privateKeyString) {
		const privateKeyBuffer = Buffer.from(decode(privateKeyString), 'binary');
		return PrivateKey.fromBuffer(privateKeyBuffer);
	}

}

export default PrivateKey;
