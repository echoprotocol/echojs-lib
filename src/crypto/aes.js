import AES from 'crypto-js/aes';
import encHex from 'crypto-js/enc-hex';
import encBase64 from 'crypto-js/enc-base64';
import assert from 'assert';
import { sha256, sha512 } from './hash';


/** Provides symetric encrypt and decrypt via AES. */
class Aes {

	/**
	 *  @constructor
	 *
	 *  @param {Buffer} iv
	 *  @param {Buffer} key
	 */
	constructor(iv, key) {
		this.iv = iv;
		this.key = key;
	}

	/**
	 *  @method clear
	 *  This is an excellent way to ensure that all references to Aes can not operate anymore
	 *  (example: a wallet becomes locked). An application should ensure
	 *  there is only one Aes object instance for a given secret `seed`.
	 */
	clear() {
		this.iv = undefined;
		this.key = undefined;
		return undefined;
	}

	/**
	 *  @method fromSeed
	 *
	 *  @param  {String} seed [secret seed may be used to encrypt or decrypt]
	 *
	 *  @return {Aes}
	 */
	static fromSeed(seed) {
		if (seed === undefined) {
			throw new Error('seed is required');
		}
		let _hash = sha512(seed);
		_hash = _hash.toString('hex');

		return Aes.fromSha512(_hash);
	}

	/**
	 *  @method fromSha512
	 *
	 *  @param  {String} hash A 128 byte hex string,
	 *  	typically one would call {@link fromSeed} instead
	 *
	 *  @return {Aes}
	 */
	static fromSha512(hash) {
		assert.equal(hash.length, 128, `A Sha512 in HEX should be 128 characters long, instead got ${hash.length}`);
		const iv = encHex.parse(hash.substring(64, 96));
		const key = encHex.parse(hash.substring(0, 64));
		return new Aes(iv, key);
	}

	/**
	 *  @method fromBuffer
	 *
	 *  @param  {Buffer} buf
	 *
	 *  @return {Aes}
	 */
	static fromBuffer(buf) {
		assert(Buffer.isBuffer(buf), 'Expecting Buffer');
		assert.equal(buf.length, 64, `A Sha512 Buffer should be 64 characters long, instead got ${buf.length}`);
		return Aes.fromSha512(buf.toString('hex'));
	}

	/**
	 *  @method decryptWithChecksum
	 *
	 *  @throws {Error} - 'Invalid Key, ...'
	 *
	 *  @param {PrivateKey} privateKey - required and used for decryption
	 *  @param {PublicKey} publicKey - required and used to calcualte the shared secret
	 *  @param {String} [nonce = ''] optional but should always be provided and
	 *  	be unique when re-using the same private/public keys more than once.
	 *  	This nonce is not a secret.
	 *  @param {String|Buffer} message - Encrypted message containing a checksum
	 *
	 *  @return {Buffer}
	 */
	static decryptWithChecksum(privateKey, publicKey, nonce, message, legacy = false) {

		// Warning: Do not put `nonce = ''` in the arguments,
		// in es6 this will not convert 'null' into an emtpy string
		// nonce null or undefined
		if (nonce === null || nonce === undefined) {
			nonce = '';
		}

		if (!Buffer.isBuffer(message)) {
			message = Buffer.from(message, 'hex');
		}

		const S = privateKey.getSharedSecret(publicKey, legacy);

		const aes = Aes.fromSeed(Buffer.concat([
			// A null or empty string nonce will not effect the hash
			Buffer.from(String(nonce)),
			Buffer.from(S.toString('hex')),
		]));

		const planebuffer = aes.decrypt(message);
		if (!(planebuffer.length >= 4)) {
			throw new Error('Invalid key, could not decrypt message(1)');
		}

		const checksum = planebuffer.slice(0, 4);
		const plaintext = planebuffer.slice(4);

		let newChecksum = sha256(plaintext);
		newChecksum = newChecksum.slice(0, 4);
		newChecksum = newChecksum.toString('hex');

		if (!(checksum.toString('hex') === newChecksum)) {
			throw new Error('Invalid key, could not decrypt message(2)');
		}

		return plaintext;
	}

	/**
	 *  @method encryptWithChecksum
	 *  Identical to {@link decryptWithChecksum} but used to encrypt.  Should not throw an error.
	 *
	 *  @param  {PrivateKey} privateKey
	 *  @param  {PublicKey} publicKey
	 *  @param  {String} nonce
	 *  @param  {String|Buffer} message
	 *
	 *  @return {Buffer} - Encrypted message which includes a checksum
	 */
	static encryptWithChecksum(privateKey, publicKey, nonce, message) {
		// Warning: Do not put `nonce = ''` in the arguments,
		// in es6 this will not convert 'null' into an emtpy string
		// nonce null or undefined
		if (nonce === null || nonce === undefined) {
			nonce = '';
		}

		if (!Buffer.isBuffer(message)) {
			message = Buffer.from(message, 'binary');
		}

		const S = privateKey.getSharedSecret(publicKey);

		const aes = Aes.fromSeed(Buffer.concat([
			// A null or empty string nonce will not effect the hash
			Buffer.from(String(nonce)),
			Buffer.from(S.toString('hex')),
		]));

		const checksum = sha256(message).slice(0, 4);
		const payload = Buffer.concat([checksum, message]);

		return aes.encrypt(payload);
	}

	/** @private */
	_decryptWordArray(cipher) {
		// https://code.google.com/p/crypto-js/#Custom_Key_and_IV
		// see wallet_records.cpp master_key::decrypt_key
		return AES.decrypt({ ciphertext: cipher, salt: null }, this.key, { iv: this.iv });
	}

	/** @private */
	_encryptWordArray(plaintext) {
		//	https://code.google.com/p/crypto-js/issues/detail?id=85
		const cipher = AES.encrypt(plaintext, this.key, { iv: this.iv });
		return encBase64.parse(cipher.toString());
	}

	/**
	 *  @method decrypt
	 *  This method does not use a checksum, the returned data must be validated some other way.
	 *
	 *  @param  {String} ciphertext
	 *
	 *  @return {Buffer}
	 */
	decrypt(ciphertext) {
		if (typeof ciphertext === 'string') {
			ciphertext = Buffer.from(ciphertext, 'binary');
		}

		if (!Buffer.isBuffer(ciphertext)) {
			throw new Error('buffer required');
		}

		assert(ciphertext, 'Missing cipher text');

		// hex is the only common format
		const hex = this.decryptHex(ciphertext.toString('hex'));
		return Buffer.from(hex, 'hex');
	}

	/**
	 *  @method encrypt
	 *  This method does not use a checksum, the returned data must be validated some other way.
	 *
	 *  @param  {String} plaintext
	 *
	 *  @return {Buffer}
	 */
	encrypt(plaintext) {
		if (typeof plaintext === 'string') {
			plaintext = Buffer.from(plaintext, 'binary');
		}
		if (!Buffer.isBuffer(plaintext)) {
			throw new Error('buffer required');
		}
		// assert plaintext, 'Missing plain text'
		// hex is the only common format
		const hex = this.encryptHex(plaintext.toString('hex'));
		return Buffer.from(hex, 'hex');
	}

	/**
	 *  @method encryptToHex
	 *  This method does not use a checksum, the returned data must be validated some other way.
	 *
	 *  @param  {String|Buffer} plaintext
	 *
	 *  @return {String}
	 */
	encryptToHex(plaintext) {
		if (typeof plaintext === 'string') {
			plaintext = Buffer.from(plaintext, 'binary');
		}
		if (!Buffer.isBuffer(plaintext)) {
			throw new Error('buffer required');
		}
		//	assert plaintext, 'Missing plain text'
		// hex is the only common format
		return this.encryptHex(plaintext.toString('hex'));
	}

	/**
	 *  @method decryptHex
	 *  This method does not use a checksum, the returned data must be validated some other way.
	 *
	 *  @param  {String} cipher - hex
	 *
	 *  @return {String} (could easily be readable text)
	 */
	decryptHex(cipher) {
		assert(cipher, 'Missing cipher text');
		// Convert data into word arrays (used by Crypto)
		const cipherArray = encHex.parse(cipher);
		const plainwords = this._decryptWordArray(cipherArray);
		return encHex.stringify(plainwords);
	}

	/**
	 *  @method decryptHexToBuffer
	 *  This method does not use a checksum, the returned data must be validated some other way.
	 *
	 *  @param  {String} cipher - hex
	 *
	 *  @return {Buffer} - encoded as specified by the parameter
	 */
	decryptHexToBuffer(cipher) {
		assert(cipher, 'Missing cipher text');
		// Convert data into word arrays (used by Crypto)
		const cipherArray = encHex.parse(cipher);
		const plainwords = this._decryptWordArray(cipherArray);
		const plainhex = encHex.stringify(plainwords);
		return Buffer.from(plainhex, 'hex');
	}

	/**
	 *  @method decryptHexToText
	 *  This method does not use a checksum, the returned data must be validated some other way.
	 *
	 *  @param  {String} cipher - hex
	 *  @param  {String} [encoding = 'binary'] - a valid Buffer encoding
	 *
	 *  @return {String} - encoded as specified by the parameter
	 */
	decryptHexToText(cipher, encoding = 'binary') {
		return this.decryptHexToBuffer(cipher).toString(encoding);
	}

	/**
	 *  @method encryptHex
	 *  This method does not use a checksum, the returned data must be validated some other way.
	 *
	 *  @param  {String} plainhex - hex
	 *
	 *  @return {String} - hex
	 */
	encryptHex(plainhex) {
		const plainArray = encHex.parse(plainhex);
		const cipherArray = this._encryptWordArray(plainArray);
		return encHex.stringify(cipherArray);
	}

}

export default Aes;
