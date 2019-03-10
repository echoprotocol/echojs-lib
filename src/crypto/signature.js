import BigInteger from 'bigi';
import { getCurveByName } from 'ecurve';

import { sha256 } from './hash';
import { sign, calcPubKeyRecoveryParam } from './ecdsa';

/** @typedef {import('./private-key').default} PrivateKey */

const secp256k1 = getCurveByName('secp256k1');

export default class Signature {

	/**
	 * @readonly
	 * @type {BigInteger}
	 */
	get r() { return this._r.clone(); }

	/**
	 * @readonly
	 * @type {BigInteger}
	 */
	get s() { return this._s.clone(); }

	/**
	 * @readonly
	 * @type {number}
	 */
	get i() { return this._i; }

	/**
	 * @param {BigInteger} r
	 * @param {BigInteger} s
	 * @param {number} i
	 */
	constructor(r, s, i) {
		/**
		 * @private
		 * @readonly
		 * @type {BigInteger}
		 */
		this._r = r.clone();
		/**
		 * @private
		 * @readonly
		 * @type {BigInteger}
		 */
		this._s = s.clone();
		/**
		 * @private
		 * @readonly
		 * @type {number}
		 */
		this._i = i;
	}

	/**
	 * @static
	 * @param {Buffer} hash
	 * @param {PrivateKey} privateKey
	 */
	static signHash(hash, privateKey) {
		if (!Buffer.isBuffer(hash)) throw new Error('invalid hash type');
		if (hash.length !== 32) throw new Error('invalid hash length');
		for (let nonce = 0; ; nonce += 1) {
			if (nonce && !(nonce % 10)) console.warn(`[WARN]: ${nonce} attempts to find canonical signature`);
			const ecs = sign(secp256k1, hash, privateKey.d, nonce);
			const der = ecs.toDER();
			const lenR = der[3];
			const lenS = der[5 + lenR];
			if ([lenR, lenS].every((len) => len === 32)) {
				const e = BigInteger.fromBuffer(hash);
				const i = calcPubKeyRecoveryParam(secp256k1, e, ecs, privateKey.toPublicKey().Q) + 31;
				return new Signature(ecs.r, ecs.s, i);
			}
		}
	}

	/**
	 * @static
	 * @param {Buffer} buffer
	 * @param {PrivateKey} privateKey
	 */
	static signSha256(buffer, privateKey) {
		const hash = sha256(buffer);
		return Signature.signHash(hash, privateKey);
	}

	/** @returns {Buffer} */
	toBuffer() {
		const result = Buffer.alloc(65);
		result.writeUInt8(this.i, 0);
		this.r.toBuffer(32).copy(result, 1);
		this.s.toBuffer(32).copy(result, 33);
		return result;
	}

}
\