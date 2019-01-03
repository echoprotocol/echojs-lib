import BigNumber from 'bignumber.js';
import UintType from './uint';

class Uint8Type extends UintType {

	constructor() {
		super(8);
	}

	/**
	 * @param {number|BigNumber} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		bytebuffer.writeUint8(BigNumber.isBigNumber(value) ? value.toNumber() : value);
	}

}

const uint8 = new Uint8Type();

export default uint8;
