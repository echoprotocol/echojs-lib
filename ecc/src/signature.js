/* eslint-disable no-bitwise */
const ByteBuffer = require('bytebuffer');
const assert = require('assert');
const BigInteger = require('bigi');
const { getCurveByName } = require('ecurve');
const {
	sign, recoverPubKey, verify, calcPubKeyRecoveryParam,
} = require('./ecdsa');
const { sha256 } = require('./hash');
const PublicKey = require('./PublicKey');

const secp256k1 = getCurveByName('secp256k1');

class Signature {

	constructor(r1, s1, i1) {
		this.r = r1;
		this.s = s1;
		this.i = i1;
		assert.equal(this.r != null, true, 'Missing parameter');
		assert.equal(this.s != null, true, 'Missing parameter');
		assert.equal(this.i != null, true, 'Missing parameter');
	}

	static fromBuffer(buf) {
		assert.equal(buf.length, 65, 'Invalid signature length');
		const i = buf.readUInt8(0);
		assert.equal(i - 27, i - 27 & 7, 'Invalid signature parameter');
		const r = BigInteger.fromBuffer(buf.slice(1, 33));
		const s = BigInteger.fromBuffer(buf.slice(33));
		return new Signature(r, s, i);
	}

	toBuffer() {
		const buf = Buffer.alloc(65);
		buf.writeUInt8(this.i, 0);
		this.r.toBuffer(32).copy(buf, 1);
		this.s.toBuffer(32).copy(buf, 33);
		return buf;
	}

	recoverPublicKeyFromBuffer(buffer) {
		return this.recoverPublicKey(sha256(buffer));
	}

	/**
		@return {PublicKey}
	*/
	recoverPublicKey(sha256Buffer) {
		const e = BigInteger.fromBuffer(sha256Buffer);
		const i = this.i - 27;
		const Q = recoverPubKey(secp256k1, e, this, i & 3);
		return PublicKey.fromPoint(Q);
	}


	/**
		@param {Buffer} buf
		@param {PrivateKey} privateKey
		@return {Signature}
	*/
	static signBuffer(buf, privateKey) {
		const _hash = sha256(buf);
		return Signature.signBufferSha256(_hash, privateKey);
	}

	/** Sign a buffer of exactally 32 bytes in size (sha256(text))
		@param {Buffer} buf - 32 bytes binary
		@param {PrivateKey} privateKey
		@return {Signature}
	*/
	static signBufferSha256(bufSHA256, privateKey) {
		if (bufSHA256.length !== 32 || !Buffer.isBuffer(bufSHA256)) {
			throw new Error('bufSHA256: 32 byte buffer requred');
		}

		let ecsignature;
		let i = null;
		let nonce = 0;
		const e = BigInteger.fromBuffer(bufSHA256);

		while (true) {
			ecsignature = sign(secp256k1, bufSHA256, privateKey.d, nonce += 1);
			const der = ecsignature.toDER();
			const lenR = der[3];
			const lenS = der[5 + lenR];
			if (lenR === 32 && lenS === 32) {
				i = calcPubKeyRecoveryParam(secp256k1, e, ecsignature, privateKey.toPublicKey().Q);
				i += 4;	// compressed
				i += 27;	// compact  //  24 or 27 :( forcing odd-y 2nd key candidate)
				break;
			}
			if (nonce % 10 === 0) {
				console.log(`WARN: ${nonce} attempts to find canonical signature`);
			}
		}
		return new Signature(ecsignature.r, ecsignature.s, i);
	}

	static sign(string, privateKey) {
		return Signature.signBuffer(Buffer.from(string), privateKey);
	}


	/**
		@param {Buffer} un-hashed
		@param {./PublicKey}
		@return {boolean}
	*/
	verifyBuffer(buf, publicKey) {
		const _hash = sha256(buf);
		return this.verifyHash(_hash, publicKey);
	}

	verifyHash(hash, publicKey) {
		assert.equal(hash.length, 32, `A SHA 256 should be 32 bytes long, instead got ${hash.length}`);
		return verify(secp256k1, hash, {
			r: this.r,
			s: this.s,
		}, publicKey.Q);
	}


	/* <HEX> */

	toByteBuffer() {
		const b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
		this.appendByteBuffer(b);
		return b.copy(0, b.offset);
	}

	static fromHex(hex) {
		return Signature.fromBuffer(Buffer.from(hex, 'hex'));
	}

	toHex() {
		return this.toBuffer().toString('hex');
	}

	static signHex(hex, privateKey) {
		const buf = Buffer.from(hex, 'hex');
		return Signature.signBuffer(buf, privateKey);
	}

	verifyHex(hex, publicKey) {
		const buf = Buffer.from(hex, 'hex');
		return this.verifyBuffer(buf, publicKey);
	}

}

module.exports = Signature;
