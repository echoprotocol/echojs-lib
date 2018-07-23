const assert = require('assert');
const { ChainConfig } = require('echojs-ws');
const { encode, decode } = require('bs58');
const deepEqual = require('deep-equal');

const { sha256, sha512, ripemd160 } = require('./hash');

/** Addresses are shortened non-reversable hashes of a public key.  The full PublicKey is preferred.
    @deprecated
*/
class Address {

	constructor(addy) {
		this.addy = addy;
	}

	static fromBuffer(buffer) {
		const _hash = sha512(buffer);
		const addy = ripemd160(_hash);
		return new Address(addy);
	}

	static fromString(string, addressPrefix = ChainConfig.address_prefix) {
		const prefix = string.slice(0, addressPrefix.length);
		assert.equal(addressPrefix, prefix, `Expecting key to begin with ${addressPrefix}, instead got ${prefix}`);
		let addy = string.slice(addressPrefix.length);
		addy = Buffer.from(decode(addy), 'binary');
		const checksum = addy.slice(-4);
		addy = addy.slice(0, -4);
		let newChecksum = ripemd160(addy);
		newChecksum = newChecksum.slice(0, 4);
		const isEqual = deepEqual(checksum, newChecksum); //	, 'Invalid checksum'
		if (!isEqual) {
			throw new Error('Checksum did not match');
		}
		return new Address(addy);
	}

	/** @return Address - Compressed PTS format (by default) */
	static fromPublic(publicKey, compressed = true, version = 56) {
		const sha2 = sha256(publicKey.toBuffer(compressed));
		const rep = ripemd160(sha2);
		const versionBuffer = Buffer.alloc(1);
		versionBuffer.writeUInt8((0xFF && version), 0);
		const addr = Buffer.concat([versionBuffer, rep]);
		let check = sha256(addr);
		check = sha256(check);
		const buffer = Buffer.concat([addr, check.slice(0, 4)]);
		return new Address(ripemd160(buffer));
	}

	toBuffer() {
		return this.addy;
	}

	toString(addressPrefix = ChainConfig.address_prefix) {
		const checksum = ripemd160(this.addy);
		const addy = Buffer.concat([this.addy, checksum.slice(0, 4)]);
		return addressPrefix + encode(addy);
	}

}

module.exports = Address;
