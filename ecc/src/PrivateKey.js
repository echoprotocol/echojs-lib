const { Point, getCurveByName } = require('ecurve');
const BigInteger = require('bigi');
const { encode, decode } = require('bs58');
const deepEqual = require('deep-equal');
const assert = require('assert');
const { sha256, sha512 } = require('./hash');
const PublicKey = require('./PublicKey');

const secp256k1 = getCurveByName('secp256k1');
const { n } = secp256k1;
const toPublic = (data) => (!data || data.Q ? data : PublicKey.fromStringOrThrow(data));

class PrivateKey {

	/**
		@private see static functions
		@param {BigInteger}
	*/
	constructor(d) {
		this.d = d;
	}

	static fromBuffer(buf) {
		if (!Buffer.isBuffer(buf)) {
			throw new Error('Expecting paramter to be a Buffer type');
		}
		if (buf.length !== 32) {
			// console.log(
			// 	`WARN: Expecting 32 bytes, instead got ${buf.length}, stack trace:`,
			// 	new Error().stack,
			// );
			throw new Error(`Expecting 32 bytes, instead got ${buf.length}`);
		}
		if (buf.length === 0) {
			throw new Error('Empty buffer');
		}
		return new PrivateKey(BigInteger.fromBuffer(buf));
	}

	/**
	 *  @method fromSeed
	 *  @param {string} seed - any length string.
	 *  This is private, the same seed produces the same private key every time.
	 *  @return {PrivateKey}
	 */
	static fromSeed(seed) { // generate_private_key
		if (!(typeof seed === 'string')) {
			throw new Error('seed must be of type string');
		}
		return PrivateKey.fromBuffer(sha256(seed));
	}

	/** @return {string} Wallet const Format (still a secret, Not encrypted) */
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
		@return {Point}
	*/
	toPublicKeyPoint() {
		return secp256k1.G.multiply(this.d);
	}

	toPublicKey() {
		if (this.public_key) {
			return this.public_key;
		}

		this.public_key = PublicKey.fromPoint(this.toPublicKeyPoint());

		return this.public_key;
	}

	toBuffer() {
		return this.d.toBuffer(32);
	}


	/** ECIES */
	getSharedSecret(publickey, legacy = false) {
		publickey = toPublic(publickey);
		const KB = publickey.toUncompressed().toBuffer();
		const KBP = Point.fromAffine(
			secp256k1,
			BigInteger.fromBuffer(KB.slice(1, 33)), // x
			BigInteger.fromBuffer(KB.slice(33, 65)), // y
		);
		const r = this.toBuffer();
		const P = KBP.multiply(BigInteger.fromBuffer(r));
		let S = P.affineX.toBuffer({ size: 32 });
		/*
		the input to sha512 must be exactly 32-bytes, to match the c++ implementation
		of getSharedSecret.  Right now S will be shorter if the most significant
		byte(s) is zero.  Pad it back to the full 32-bytes
		*/
		if (!legacy && S.length < 32) {
			const pad = Buffer.alloc(32 - S.length).fill(0);
			S = Buffer.concat([pad, S]);
		}

		// SHA512 used in ECIES
		return sha512(S);
	}

	// /** ECIES (does not always match the Point.fromAffine version above) */
	// getSharedSecret(publickey){
	//	 publickey = toPublic(publickey)
	//		let P = publickey.Q.multiply( this.d );
	//		let S = P.affineX.toBuffer({size: 32});
	//	 // ECIES, adds an extra sha512
	//	 return sha512(S);
	// }

	/** @throws {Error} - overflow of the key could not be derived */
	child(offset) {
		offset = Buffer.concat([this.toPublicKey().toBuffer(), offset]);
		offset = sha256(offset);
		const c = BigInteger.fromBuffer(offset);

		if (c.compareTo(n) >= 0) {
			throw new Error('Child offset went out of bounds, try again');
		}

		const derived = this.d.add(c);	//	.mod(n)

		if (derived.signum() === 0) {
			throw new Error('Child offset derived to an invalid key, try again');
		}

		return new PrivateKey(derived);
	}

	/* <helper_functions> */

	// toByteBuffer() {
	// 	let b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
	// 	this.appendByteBuffer(b);
	// 	return b.copy(0, b.offset);
	// }

	static fromHex(hex) {
		return PrivateKey.fromBuffer(Buffer.from(hex, 'hex'));
	}

	toHex() {
		return this.toBuffer().toString('hex');
	}

	/* </helper_functions> */

}

module.exports = PrivateKey;
