// https://code.google.com/p/crypto-js
const AES = require('crypto-js/aes');
const encHex = require('crypto-js/enc-hex');
const encBase64 = require('crypto-js/enc-base64');
const assert = require('assert');
const { sha256, sha512 } = require('./hash');

// const { DEBUG } = process.env;

/** Provides symetric encrypt and decrypt via AES. */
class Aes {

	/** @private */
	constructor(iv, key) {
		this.iv = iv;
		this.key = key;
	}

	/**
	 *  This is an excellent way to ensure that all references to Aes can not operate anymore
	 *  (example: a wallet becomes locked). An application should ensure
	 *  there is only one Aes object instance for a given secret `seed`.
	 */
	clear() {
		this.iv = undefined;
		this.key = undefined;
		return undefined;
	}

	/** @arg {string} seed - secret seed may be used to encrypt or decrypt. */
	static fromSeed(seed) {
		if (seed === undefined) {
			throw new Error('seed is required');
		}
		let _hash = sha512(seed);
		_hash = _hash.toString('hex');
		// if (DEBUG) {
		// 	console.log('... fromSeed _hash', _hash);
		// }
		return Aes.fromSha512(_hash);
	}

	/**
	 *  [fromSha512 description]
	 *  @param  {String} hash A 128 byte hex string,
	 *  typically one would call {@link fromSeed} instead.
	 *  @return {Aes}
	 */
	static fromSha512(hash) {
		assert.equal(hash.length, 128, `A Sha512 in HEX should be 128 characters long, instead got ${hash.length}`);
		const iv = encHex.parse(hash.substring(64, 96));
		const key = encHex.parse(hash.substring(0, 64));
		return new Aes(iv, key);
	}

	static fromBuffer(buf) {
		assert(Buffer.isBuffer(buf), 'Expecting Buffer');
		assert.equal(buf.length, 64, `A Sha512 Buffer should be 64 characters long, instead got ${buf.length}`);
		return Aes.fromSha512(buf.toString('hex'));
	}

	/**
	 *  @throws {Error} - 'Invalid Key, ...'
	 *  @arg {PrivateKey} privateKey - required and used for decryption
	 *  @arg {PublicKey} publicKey - required and used to calcualte the shared secret
	 *  @arg {string} [nonce = ''] optional but should always be provided and
	 *  be unique when re-using the same private/public keys more than once.
	 *  This nonce is not a secret.
	 *  @arg {string|Buffer} message - Encrypted message containing a checksum
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
		// if (DEBUG) {
		// 	console.log('decryptWithChecksum', {
		// 		priv_to_pub: privateKey.toPublicKey().toString(),
		// 		pub: publicKey.toPublicKeyString(),
		// 		message: message.length,
		// 		S: S.toString('hex'),
		// 		nonce,
		// 	});
		// }

		const aes = Aes.fromSeed(Buffer.concat([
			// A null or empty string nonce will not effect the hash
			Buffer.from(String(nonce)),
			Buffer.from(S.toString('hex')),
		]));

		const planebuffer = aes.decrypt(message);
		if (!(planebuffer.length >= 4)) {
			throw new Error('Invalid key, could not decrypt message(1)');
		}

		// if (DEBUG) {
		// 	console.log('... planebuffer', planebuffer);
		// }
		const checksum = planebuffer.slice(0, 4);
		const plaintext = planebuffer.slice(4);

		// console.log('... checksum',checksum.toString('hex'))
		// console.log('... plaintext',plaintext.toString())

		let newChecksum = sha256(plaintext);
		newChecksum = newChecksum.slice(0, 4);
		newChecksum = newChecksum.toString('hex');

		if (!(checksum.toString('hex') === newChecksum)) {
			throw new Error('Invalid key, could not decrypt message(2)');
		}

		return plaintext;
	}

	/** Identical to {@link decryptWithChecksum} but used to encrypt.  Should not throw an error.
		@return {Buffer} message - Encrypted message which includes a checksum
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

		// if (DEBUG) {
		// 	console.log('encryptWithChecksum', {
		// 		priv_to_pub: privateKey.toPublicKey().toString(),
		// 		pub: publicKey.toPublicKeyString(),
		// 		message: message.length,
		// 		S: S.toString('hex'),
		// 		nonce,
		// 	});
		// }
		const aes = Aes.fromSeed(Buffer.concat([
			// A null or empty string nonce will not effect the hash
			Buffer.from(String(nonce)),
			Buffer.from(S.toString('hex')),
		]));

		// if (DEBUG) {
		// 	console.log('... S', S.toString('hex'));
		// }

		const checksum = sha256(message).slice(0, 4);
		const payload = Buffer.concat([checksum, message]);

		// if (DEBUG) {
		// 	console.log('... payload', payload.toString());
		// }

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

	/** This method does not use a checksum, the returned data must be validated some other way.
		@arg {string} ciphertext
		@return {Buffer} binary
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

	/** This method does not use a checksum, the returned data must be validated some other way.
		@arg {string} plaintext
		@return {Buffer} binary
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

	/** This method does not use a checksum, the returned data must be validated some other way.
		@arg {string|Buffer} plaintext
		@return {string} hex
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

	/** This method does not use a checksum, the returned data must be validated some other way.
		@arg {string} cipher - hex
		@return {string} binary (could easily be readable text)
	*/
	decryptHex(cipher) {
		assert(cipher, 'Missing cipher text');
		// Convert data into word arrays (used by Crypto)
		const cipherArray = encHex.parse(cipher);
		const plainwords = this._decryptWordArray(cipherArray);
		return encHex.stringify(plainwords);
	}

	/** This method does not use a checksum, the returned data must be validated some other way.
		@arg {string} cipher - hex
		@return {Buffer} encoded as specified by the parameter
	*/
	decryptHexToBuffer(cipher) {
		assert(cipher, 'Missing cipher text');
		// Convert data into word arrays (used by Crypto)
		const cipherArray = encHex.parse(cipher);
		const plainwords = this._decryptWordArray(cipherArray);
		const plainhex = encHex.stringify(plainwords);
		return Buffer.from(plainhex, 'hex');
	}

	/** This method does not use a checksum, the returned data must be validated some other way.
		@arg {string} cipher - hex
		@arg {string} [encoding = 'binary'] - a valid Buffer encoding
		@return {String} encoded as specified by the parameter
	*/
	decryptHexToText(cipher, encoding = 'binary') {
		return this.decryptHexToBuffer(cipher).toString(encoding);
	}

	/** This method does not use a checksum, the returned data must be validated some other way.
		@arg {string} plainhex - hex format
		@return {String} hex
	*/
	encryptHex(plainhex) {
		const plainArray = encHex.parse(plainhex);
		const cipherArray = this._encryptWordArray(plainArray);
		return encHex.stringify(cipherArray);
	}

}

module.exports = Aes;
