import BigNumber from 'bignumber.js';
import UintType from './uint';

class Uint16Type extends UintType {

	constructor() {
		super(16);
	}

	/**
	 * @param {number|BigNumber} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		bytebuffer.writeUint16(BigNumber.isBigNumber(value) ? value.toNumber() : value);
	}

}

const uint16 = new Uint16Type();

export default uint16;
