import assert from "assert";
import { ChainConfig } from "echojs-ws";
import { sha256, sha512, ripemd160 } from "./hash";
import { encode, decode } from "bs58";
import deepEqual from "deep-equal";

/** Addresses are shortened non-reversable hashes of a public key.  The full PublicKey is preferred.
    @deprecated
*/
class Address {

	constructor(addy) {
		this.addy = addy;
	}

	static fromBuffer(buffer) {
		let _hash = sha512(buffer);
		let addy = ripemd160(_hash);
		return new Address(addy);
	}

	static fromString(string, address_prefix = ChainConfig.address_prefix) {
		let prefix = string.slice(0, address_prefix.length);
		assert.equal(address_prefix, prefix, `Expecting key to begin with ${address_prefix}, instead got ${prefix}`);
		let addy = string.slice(address_prefix.length);
		addy = new Buffer(decode(addy), "binary");
		let checksum = addy.slice(-4);
		addy = addy.slice(0, -4);
		let new_checksum = ripemd160(addy);
		new_checksum = new_checksum.slice(0, 4);
		let isEqual = deepEqual(checksum, new_checksum); //, 'Invalid checksum'
		if (!isEqual) {
			throw new Error("Checksum did not match");
		}
		return new Address(addy);
	}

	/** @return Address - Compressed PTS format (by default) */
	static fromPublic(public_key, compressed = true, version = 56) {
		let sha2 = sha256(public_key.toBuffer(compressed));
		let rep = ripemd160(sha2);
		let versionBuffer = new Buffer(1);
		versionBuffer.writeUInt8((0xFF & version), 0);
		let addr = Buffer.concat([versionBuffer, rep]);
		let check = sha256(addr);
		check = sha256(check);
		let buffer = Buffer.concat([addr, check.slice(0, 4)]);
		return new Address(ripemd160(buffer));
	}

	toBuffer() {
		return this.addy;
	}

	toString(address_prefix = ChainConfig.address_prefix) {
		let checksum = ripemd160(this.addy);
		let addy = Buffer.concat([this.addy, checksum.slice(0, 4)]);
		return address_prefix + encode(addy);
	}
}

export default Address;
