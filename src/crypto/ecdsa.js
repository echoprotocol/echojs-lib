import BigInteger from 'bigi';
import { sha256, HmacSHA256 } from './hash';
import ECSignature from './ECSignature';
import { validateUnsignedSafeInteger } from '../utils/validators';

// FIXME: jsdoc
/**
 * @param {*} curve
 * @param {Buffer} hash
 * @param {BigInteger} d
 * @param {*} checkSig
 * @param {number} nonce
 */
export function deterministicGenerateK(curve, hash, d, checkSig, nonce) {
	if (nonce) hash = sha256(Buffer.concat([hash, Buffer.alloc(nonce)]));
	// sanity transaction.js
	if (hash.length !== 32) throw new Error('invalid sha256 hash length');
	const x = d.toBuffer(32);
	let k = Buffer.alloc(32);
	let v = Buffer.alloc(32);
	// Step B
	v.fill(1);
	// Step C
	k.fill(0);
	// Step D
	k = HmacSHA256(Buffer.concat([v, Buffer.from([0]), x, hash]), k);
	// Step E
	v = HmacSHA256(v, k);
	// Step F
	k = HmacSHA256(Buffer.concat([v, Buffer.from([1]), x, hash]), k);
	// Step G
	v = HmacSHA256(v, k);
	// Step H1/H2a, ignored as tlen === qlen (256 bit)
	// Step H2b
	v = HmacSHA256(v, k);
	// Step H3, repeat until T is within the interval [1, n - 1]
	for (let T = BigInteger.fromBuffer(v); ;) {
		if ((T.signum() > 0) && (T.compareTo(curve.n) < 0) && checkSig(T)) return T;
		k = HmacSHA256(Buffer.concat([v, Buffer.from([0])]), k);
		v = HmacSHA256(v, k);
		// Step H1/H2a, again, ignored as tlen === qlen (256 bit)
		// Step H2b again
		v = HmacSHA256(v, k);
		T = BigInteger.fromBuffer(v);
	}
}

// FIXME: jsdoc
/**
 * @param {*} curve
 * @param {Buffer} hash
 * @param {*} d
 * @param {number} nonce
 */
export function sign(curve, hash, d, nonce) {
	const e = BigInteger.fromBuffer(hash);
	const { n, G } = curve;
	let r;
	let s;
	deterministicGenerateK(curve, hash, d, (k) => {
		// find canonically valid signature
		const Q = G.multiply(k);
		if (curve.isInfinity(Q)) return false;
		r = Q.affineX.mod(n);
		if (r.signum() === 0) return false;
		s = k.modInverse(n).multiply(e.add(d.multiply(r))).mod(n);
		if (s.signum() === 0) return false;
		return true;
	}, nonce);
	const N_OVER_TWO = n.shiftRight(1);
	// enforce low S values, see bip62: 'low s values in signatures'
	if (s.compareTo(N_OVER_TWO) > 0) s = n.subtract(s);
	return new ECSignature(r, s);
}

// FIXME: jsdoc
/**
 * @param {*} curve
 * @param {*} e
 * @param {ECSignature} signature
 * @param {number} i
 */
function recoverPubKey(curve, e, signature, i) {
	validateUnsignedSafeInteger(i);
	if (i > 3) throw new Error('Recovery param is more than two bits');
	const { n, G } = curve;
	const { r, s } = signature;
	if (r.signum() <= 0 || r.compareTo(n) >= 0) throw new Error('invalid r-component');
	if (s.signum() <= 0 || s.compareTo(n) >= 0) throw new Error('invalid s-component');
	// A set LSB signifies that the y-coordinate is odd
	const isYOdd = i % 2;
	// The more significant bit specifies whether we should use the
	// first or second candidate key.
	const isSecondKey = Math.floor(i / 2);
	// 1.1 Let x = r + jn
	const x = isSecondKey ? r.add(n) : r;
	const R = curve.pointFromX(isYOdd, x);
	// 1.4 Check that nR is at infinity
	const nR = R.multiply(n);
	if (!curve.isInfinity(nR)) throw new Error('nR is not a valid curve point');
	// Compute -e = require(e
	const eNeg = e.negate().mod(n);
	// 1.6.1 Compute Q = r^-1 * (sR-eG)
	const rInv = r.modInverse(n);
	const Q = R.multiplyTwo(s, G, eNeg).multiply(rInv);
	curve.validate(Q);
	return Q;
}

export function calcPubKeyRecoveryParam(curve, e, signature, Q) {
	for (let i = 0; i < 4; i += 1) {
		const Qprime = recoverPubKey(curve, e, signature, i);
		// 1.6.2 Verify Q
		if (Qprime.equals(Q)) return i;
	}
	throw new Error('Unable to find valid recovery factor');
}
