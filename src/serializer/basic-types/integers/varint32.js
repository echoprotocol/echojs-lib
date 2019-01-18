import BigNumber from 'bignumber.js';
import IntType from './int';

class Varint32Type extends IntType {

	constructor() {
		super(32);
	}

	/**
	 * @param {number|BigNumber} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		bytebuffer.writeVarint32(BigNumber.isBigNumber(value) ? value.toNumber() : value);
	}

}

export default new Varint32Type();
