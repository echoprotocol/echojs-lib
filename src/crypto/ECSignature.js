import BigInteger from 'bigi';

export default class ECSignature {

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
	 * @param {BigInteger} r
	 * @param {BigInteger} s
	 */
	constructor(r, s) {
		if (!(r instanceof BigInteger)) throw new Error('invalid r-component type');
		if (!(s instanceof BigInteger)) throw new Error('invalid s-component type');
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
	}

	/** @returns {Buffer} */
	toDER() {
		const rBa = this.r.toDERInteger();
		const sBa = this.s.toDERInteger();
		let sequence = [];
		// INTEGER
		sequence.push(0x02, rBa.length);
		sequence = sequence.concat(rBa);
		// INTEGER
		sequence.push(0x02, sBa.length);
		sequence = sequence.concat(sBa);
		// SEQUENCE
		sequence.unshift(0x30, sequence.length);
		return Buffer.from(sequence);
	}

	// TODO: write implementation

}
