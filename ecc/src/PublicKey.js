const ByteBuffer = require('bytebuffer');
const { encode, decode } = require('bs58');
const { ChainConfig } = require('echojs-ws');
const assert = require('assert');
const { sha512, ripemd160 } = require('./hash');

class PublicKey {

	/**  key
	 * @param buffer
	 */
	constructor(buffer) {
		this.buffer = buffer;
	}

	static fromBinary(bin) {
		return PublicKey.fromBuffer(Buffer.from(bin, 'binary'));
	}

	static fromBuffer(buffer) {
		if (buffer.toString('hex') === '000000000000000000000000000000000000000000000000000000000000000000') {
			return new PublicKey(null);
		}
		return new PublicKey(buffer);
	}

	toBuffer() {
		if (this.buffer === null) {
			return Buffer.from('000000000000000000000000000000000000000000000000000000000000000000', 'hex');
		}
		return this.buffer;
	}

	/** bts::blockchain::address (unique but not a full public key) */
	toBlockchainAddress() {
		const pubBuf = this.toBuffer();
		const pubSha = sha512(pubBuf);
		return ripemd160(pubSha);
	}

	/** Alias for {@link toPublicKeyString} */
	toString(addressPrefix = ChainConfig.address_prefix) {
		return this.toPublicKeyString(addressPrefix);
	}

	/**
		Full public key
		{return} string
	*/
	toPublicKeyString(addressPrefix = ChainConfig.address_prefix) {
		const pubBuf = this.toBuffer();
		return addressPrefix + encode(pubBuf);
	}

	/**
		@arg {string} publicKey - like ECHOXyz...
		@arg {string} addressPrefix - like ECHO
		@return PublicKey or `null` (if the publicKey string is invalid)
	*/
	static fromPublicKeyString(publicKey, addressPrefix = ChainConfig.address_prefix) {
		try {
			return PublicKey.fromStringOrThrow(publicKey, addressPrefix);
		} catch (e) {
			return null;
		}
	}

	/**
		@arg {string} publicKey - like ECHOXyz...
		@arg {string} addressPrefix - like ECHO
		@throws {Error} if public key is invalid
		@return PublicKey
	*/
	static fromStringOrThrow(publicKey, addressPrefix = ChainConfig.address_prefix) {
		const prefix = publicKey.slice(0, addressPrefix.length);
		assert.equal(
			addressPrefix,
			prefix,
			`Expecting key to begin with ${addressPrefix}, instead got ${prefix}`,
		);
		publicKey = publicKey.slice(addressPrefix.length);

		publicKey = Buffer.from(decode(publicKey), 'binary');
		return PublicKey.fromBuffer(publicKey);
	}

	/* <HEX> */

	toByteBuffer() {
		const b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
		this.appendByteBuffer(b);
		return b.copy(0, b.offset);
	}

	static fromHex(hex) {
		return PublicKey.fromBuffer(Buffer.from(hex, 'hex'));
	}

	toHex() {
		return this.toBuffer().toString('hex');
	}

	static fromPublicKeyStringHex(hex) {
		return PublicKey.fromPublicKeyString(Buffer.from(hex, 'hex'));
	}

	/* </HEX> */

}


module.exports = PublicKey;
