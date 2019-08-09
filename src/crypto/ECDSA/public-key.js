import ByteBuffer from 'bytebuffer';
import BigInteger from 'bigi';
import { Point, getCurveByName } from 'ecurve';
import { encode, decode } from 'bs58';
import assert from 'assert';
import deepEqual from 'deep-equal';

import { ADDRESS_PREFIX } from '../../constants/chain-config';
import { sha256, sha512, ripemd160 } from '../hash';

const secp256k1 = getCurveByName('secp256k1');

const { G, n } = secp256k1;

class PublicKey {

	/**
	 *  @constructor
	 *
	 *  @param {Point} Q
	 */
	constructor(Q) {
		this.Q = Q;
	}

	/**
	 *  @method fromBinary
	 *
	 *  @param  {String|Array} bin
	 *
	 *  @return {PublicKey}
	 */
	static fromBinary(bin) {
		return PublicKey.fromBuffer(Buffer.from(bin, 'binary'));
	}

	/**
	 *  @method fromBuffer
	 *
	 *  @param  {Buffer} buffer
	 *
	 *  @return {PublicKey}
	 */
	static fromBuffer(buffer) {
		if (buffer.toString('hex') === '000000000000000000000000000000000000000000000000000000000000000000') {
			return new PublicKey(null);
		}
		return new PublicKey(Point.decodeFrom(secp256k1, buffer));
	}

	/**
	 *  @method toBuffer
	 *
	 *  @param  {Point|null} compressed
	 *
	 *  @return {Buffer}
	 */
	toBuffer(compressed = this.Q ? this.Q.compressed : null) {
		if (this.Q === null) {
			return Buffer.from('000000000000000000000000000000000000000000000000000000000000000000', 'hex');
		}
		return this.Q.getEncoded(compressed);
	}

	/**
	 *  @method fromPoint
	 *
	 *  @param  {Point} point
	 *
	 *  @return {PublicKey}
	 */
	static fromPoint(point) {
		return new PublicKey(point);
	}

	/**
	 *  @method toUncompressed
	 *
	 *  @return {PublicKey}
	 */
	toUncompressed() {
		const buf = this.Q.getEncoded(false);
		const point = Point.decodeFrom(secp256k1, buf);
		return PublicKey.fromPoint(point);
	}

	/**
	 *  @method toBlockchainAddress
	 *
	 *  @return {String}
	 */
	toBlockchainAddress() {
		const pubBuf = this.toBuffer();
		const pubSha = sha512(pubBuf);
		return ripemd160(pubSha);
	}

	/**
	 *  @method toString
	 *  Alias for {@link toPublicKeyString}
	 *
	 *  @param  {String} [addressPrefix=CHAIN_CONFIG.ADDRESS_PREFIX]
	 *
	 *  @return {String}
	 */
	toString(addressPrefix = ADDRESS_PREFIX) {
		return this.toPublicKeyString(addressPrefix);
	}

	/**
	 *  @method toPublicKeyString
	 *  Full public key
	 *
	 *  @param  {String} [addressPrefix=CHAIN_CONFIG.ADDRESS_PREFIX]
	 *
	 *  @return {String}
	 */
	toPublicKeyString(addressPrefix = ADDRESS_PREFIX) {
		const pubBuf = this.toBuffer();
		const checksum = ripemd160(pubBuf);
		const addy = Buffer.concat([pubBuf, checksum.slice(0, 4)]);
		return addressPrefix + encode(addy);
	}

	/**
	 *  @method fromPublicKeyString
	 *
	 *  @param  {String} publicKey
	 *  @param  {String} [addressPrefix=CHAIN_CONFIG.ADDRESS_PREFIX]
	 *
	 *  @return {PublicKey|null} (if the publicKey string is invalid)
	 */
	static fromPublicKeyString(publicKey, addressPrefix = ADDRESS_PREFIX) {
		try {
			return PublicKey.fromStringOrThrow(publicKey, addressPrefix);
		} catch (e) {
			return null;
		}
	}

	/**
	 *  @method fromStringOrThrow
	 *
	 *  @param  {String} publicKey
	 *  @param  {String} [addressPrefix=CHAIN_CONFIG.ADDRESS_PREFIX]
	 *
	 *  @throws {Error} if public key is invalid
	 *
	 *  @return {PublicKey}
	 */
	static fromStringOrThrow(publicKey, addressPrefix = ADDRESS_PREFIX) {
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

	/**
	 *  @method toAddressString
	 *
	 *  @param  {String} [addressPrefix=CHAIN_CONFIG.ADDRESS_PREFIX]
	 *
	 *  @return {String}
	 */
	toAddressString(addressPrefix = ADDRESS_PREFIX) {
		const pubBuf = this.toBuffer();
		const pubSha = sha512(pubBuf);
		let addy = ripemd160(pubSha);
		const checksum = ripemd160(addy);
		addy = Buffer.concat([addy, checksum.slice(0, 4)]);
		return addressPrefix + encode(addy);
	}

	/**
	 *  @method toPtsAddy
	 */
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

	/**
	 *	@method child
	 *
	 *  @param  {Buffer} offset
	 *
	 *  @return {PublicKey}
	 */
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

	/**
	 *  @method toByteBuffer
	 *
	 *  @return {ByteBuffer}
	 */
	toByteBuffer() {
		const b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
		this.appendByteBuffer(b);
		return b.copy(0, b.offset);
	}

	/**
	 *  @method fromHex
	 *
	 *  @param  {String} hex
	 *
	 *  @return {PublicKey}
	 */
	static fromHex(hex) {
		return PublicKey.fromBuffer(Buffer.from(hex, 'hex'));
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
	 *  @method fromPublicKeyStringHex
	 *
	 *  @param  {String} hex
	 *
	 *  @return {PublicKey}
	 */
	static fromPublicKeyStringHex(hex) {
		return PublicKey.fromPublicKeyString(Buffer.from(hex, 'hex'));
	}

}


export default PublicKey;
