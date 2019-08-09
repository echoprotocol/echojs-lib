import ByteBuffer from 'bytebuffer';
import { encode, decode } from 'bs58';
import assert from 'assert';

import { ADDRESS_PREFIX } from '../constants/chain-config';
import { sha512, ripemd160 } from './hash';

class PublicKey {

	/**
	 *  @constructor
	 *
	 *  @param {Buffer} buffer
	 */
	constructor(buffer) {
		this.buffer = buffer;
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

		return new PublicKey(buffer);

	}

	/**
	 *  @method toBuffer
	 *
	 *  @return {Buffer}
	 */
	toBuffer() {
		if (this.buffer === null) {
			return Buffer.from('000000000000000000000000000000000000000000000000000000000000000000', 'hex');
		}
		return this.buffer;
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
		return addressPrefix + encode(pubBuf);
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
			console.error('error', e);
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

		return PublicKey.fromBuffer(publicKey);
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
