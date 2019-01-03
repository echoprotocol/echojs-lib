import BigNumber from 'bignumber.js';
import UintType from './uint';

class Uint32Type extends UintType {

	constructor() {
		super(32);
	}

	/**
	 * @param {number|BigNumber} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		bytebuffer.writeUint32(BigNumber.isBigNumber(value) ? value.toNumber() : value);
	}

}

const uint32 = new Uint32Type();

export default uint32;
