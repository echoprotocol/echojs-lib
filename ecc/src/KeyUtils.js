const secureRandom = require('secure-random');
const { ChainConfig } = require('echojs-ws');
const PrivateKey = require('./PrivateKey');
const PublicKey = require('./PublicKey');
const Address = require('./address');
const Aes = require('./aes');

const { sha256, sha512 } = require('./hash');
// const dictionary = require('./dictionary_en';

// hash for .25 second
const HASH_POWER_MILLS = 250;

const key = {
	/** Uses 1 second of hashing power to create a key/password checksum.  An
	implementation can re-call this method with the same password to re-match
	the strength of the CPU (either after moving = require(a desktop to a mobile,
	mobile to desktop, or N years = require(now when CPUs are presumably stronger).

	A salt is used for all the normal reasons...

	@return object {
		aes_private: Aes,
		checksum: '{hash_iteration_count},{salt},{checksum}'
	}
	*/
	aes_checksum(password) {
		if (!(typeof password === 'string')) {
			throw new Error('password string required');
		}
		const salt = secureRandom.randomBuffer(4).toString('hex');
		let iterations = 0;
		let secret = salt + password;
		// hash for .1 second
		const startT = Date.now();
		while (Date.now() - startT < HASH_POWER_MILLS) {
			secret = sha256(secret);
			iterations += 1;
		}
		const checksum = sha256(secret);
		const checksumString = [
			iterations,
			salt.toString('hex'),
			checksum.slice(0, 4).toString('hex'),
		].join(',');
		return {
			aes_private: Aes.fromSeed(secret),
			checksum: checksumString,
		};
	},

	/** Provide a matching password and keyChecksum.  A 'wrong password'
	error is thrown if the password does not match.  If this method takes
	much more or less than 1 second to return, one should consider updating
	all encyrpted fields using a new key.key_checksum.
	*/
	aes_private(password, keyChecksum) {
		const [iterations, salt, checksum] = keyChecksum.split(',');
		let secret = salt + password;
		for (let i = 0; iterations > 0 ? i < iterations : i > iterations; i += 1) {
			secret = sha256(secret);
		}
		const newChecksum = sha256(secret);
		if (!(newChecksum.slice(0, 4).toString('hex') === checksum)) {
			throw new Error('wrong password');
		}
		return Aes.fromSeed(secret);
	},

	/**
		A week random number generator can run out of entropy.
		This should ensure even the worst random number implementation will be reasonably safe.

		@param1 string entropy of at least 32 bytes
	*/
	random32ByteBuffer(entropy = this.browserEntropy()) {
		if (!(typeof entropy === 'string')) {
			throw new Error('string required for entropy');
		}
		if (entropy.length < 32) {
			throw new Error('expecting at least 32 bytes of entropy');
		}
		const startT = Date.now();
		while (Date.now() - startT < HASH_POWER_MILLS) {
			entropy = sha256(entropy);
		}
		const hashArray = [];
		hashArray.push(entropy);
		// Hashing for 1 second may helps the computer is not low on entropy
		// (this method may be called back-to-back).
		hashArray.push(secureRandom.randomBuffer(32));
		return sha256(Buffer.concat(hashArray));
	},

	suggest_brain_key(dictionary = ',', entropy = this.browserEntropy()) {
		const randomBuffer = this.random32ByteBuffer(entropy);
		const wordCount = 16;
		const dictionaryLines = dictionary.split(',');
		if (!(dictionaryLines.length === 49744)) {
			throw new Error(`expecting ${49744} but got ${dictionaryLines.length} dictionary words`);
		}
		const brainkey = [];
		const end = wordCount * 2;
		for (let i = 0; i < end; i += 2) {
			// randomBuffer has 256 bits / 16 bits per word == 16 words
			const num = (randomBuffer[i] * (2 ** 8)) + randomBuffer[i + 1];
			// convert into a number between 0 and 1 (inclusive)
			const rndMultiplier = num / (2 ** 16);
			const wordIndex = Math.round(dictionaryLines.length * rndMultiplier);
			brainkey.push(dictionaryLines[wordIndex]);
		}
		return this.normalize_brainKey(brainkey.join(' '));
	},

	get_random_key(entropy) {
		return PrivateKey.fromBuffer(this.random32ByteBuffer(entropy));
	},

	get_brainPrivateKey(brainKey, sequence = 0) {
		if (sequence < 0) {
			throw new Error('invalid sequence');
		}
		brainKey = key.normalize_brainKey(brainKey);
		return PrivateKey.fromBuffer(sha256(sha512(`${brainKey} ${sequence}`)));
	},

	// Turn invisible space like characters into a single space
	normalize_brainKey(brainKey) {
		if (!(typeof brainKey === 'string')) {
			throw new Error('string required for brainKey');
		}
		brainKey = brainKey.trim();
		return brainKey.split(/[\t\n\v\f\r ]+/).join(' ');
	},

	browserEntropy() {
		let entropyStr = '';
		try {
			const {
				screen: {
					height,
					width,
					colorDepth,
					availHeight,
					availWidth,
					pixelDepth,
				},
				navigator: { language },
				location,
				history,
			} = window;
			entropyStr = `${new Date().toString()} ${height} ${width} ${colorDepth} ${availHeight} ${availWidth} ${pixelDepth} ${language} ${location} ${history.length} `;

			for (let i = 0; i < navigator.mimeTypes.length; i += 1) {
				const { description, type, suffixes } = navigator.mimeTypes[i];
				entropyStr += `${description} ${type} ${suffixes} `;
			}
			// console.log('INFO\tbrowserEntropy gathered');
		} catch (error) {
			//	nodejs:ReferenceError: window is not defined
			entropyStr = sha256((new Date()).toString());
		}

		const b = Buffer.from(entropyStr);
		entropyStr += `${b.toString('binary')} ${new Date().toString()}`;
		return entropyStr;
	},

	// @return array of 5 legacy addresses for a pubkey string parameter.
	addresses(pubkey, addressPrefix = ChainConfig.address_prefix) {
		const publicKey = PublicKey.fromPublicKeyString(pubkey, addressPrefix);
		// S L O W
		const addressString = [
			Address.fromPublic(publicKey, false, 0).toString(addressPrefix), // btc_uncompressed
			Address.fromPublic(publicKey, true, 0).toString(addressPrefix), // btc_compressed
			Address.fromPublic(publicKey, false, 56).toString(addressPrefix), // pts_uncompressed
			Address.fromPublic(publicKey, true, 56).toString(addressPrefix), // pts_compressed
			publicKey.toAddressString(addressPrefix), // bts_short, most recent format
		];
		return addressString;
	},
};

module.exports = key;
