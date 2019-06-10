const ByteBuffer = require('bytebuffer');
const BigInteger = require('bigi');
const { Point, getCurveByName } = require('ecurve');
const { encode, decode } = require('bs58');
const { ChainConfig } = require('echojs-ws');
const assert = require('assert');
const deepEqual = require('deep-equal');

const { sha256, sha512, ripemd160 } = require('../hash');

const secp256k1 = getCurveByName('secp256k1');

const { G, n } = secp256k1;

class PublicKey {

	/** @param {Point} public key */
	constructor(Q) {
		this.Q = Q;
	}

	static fromBinary(bin) {
		return PublicKey.fromBuffer(Buffer.from(bin, 'binary'));
	}

	static fromBuffer(buffer) {
		if (buffer.toString('hex') === '000000000000000000000000000000000000000000000000000000000000000000') {
			return new PublicKey(null);
		}
		return new PublicKey(Point.decodeFrom(secp256k1, buffer));
	}

	toBuffer(compressed = this.Q ? this.Q.compressed : null) {
		if (this.Q === null) {
			return Buffer.from('000000000000000000000000000000000000000000000000000000000000000000', 'hex');
		}
		return this.Q.getEncoded(compressed);
	}

	static fromPoint(point) {
		return new PublicKey(point);
	}

	toUncompressed() {
		const buf = this.Q.getEncoded(false);
		const point = Point.decodeFrom(secp256k1, buf);
		return PublicKey.fromPoint(point);
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
		const checksum = ripemd160(pubBuf);
		const addy = Buffer.concat([pubBuf, checksum.slice(0, 4)]);
		return addressPrefix + encode(addy);
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
		const checksum = publicKey.slice(-4);
		publicKey = publicKey.slice(0, -4);
		let newChecksum = ripemd160(publicKey);
		newChecksum = newChecksum.slice(0, 4);
		const isEqual = deepEqual(checksum, newChecksum); //	, 'Invalid checksum'
		if (!isEqual) {
			throw new Error('Checksum did not match');
		}
		return PublicKey.fromBuffer(publicKey);
	}

	toAddressString(addressPrefix = ChainConfig.address_prefix) {
		const pubBuf = this.toBuffer();
		const pubSha = sha512(pubBuf);
		let addy = ripemd160(pubSha);
		const checksum = ripemd160(addy);
		addy = Buffer.concat([addy, checksum.slice(0, 4)]);
		return addressPrefix + encode(addy);
	}

	toPtsAddy() {
		const pubBuf = this.toBuffer();
		const pubSha = sha256(pubBuf);
		let addy = ripemd160(pubSha);
		addy = Buffer.concat([Buffer.from([0x38]), addy]); //	version 56(decimal)

		let checksum = sha256(addy);
		checksum = sha256(checksum);

		addy = Buffer.concat([addy, checksum.slice(0, 4)]);
		return encode(addy);
	}

	child(offset) {

		assert(Buffer.isBuffer(offset), 'Buffer required: offset');
		assert.equal(offset.length, 32, 'offset length');

		offset = Buffer.concat([this.toBuffer(), offset]);
		offset = sha256(offset);

		const c = BigInteger.fromBuffer(offset);

		if (c.compareTo(n) >= 0) {
			throw new Error('Child offset went out of bounds, try again');
		}


		const cG = G.multiply(c);
		const Qprime = this.Q.add(cG);

		if (secp256k1.isInfinity(Qprime)) {
			throw new Error('Child offset derived to an invalid key, try again');
		}

		return PublicKey.fromPoint(Qprime);
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
