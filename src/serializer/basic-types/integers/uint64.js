import BigNumber from 'bignumber.js';
import UintType from './uint';
import { BigNumberToLong } from '../../../utils/converters';

class Uint64Type extends UintType {

	constructor() {
		super(64);
	}

	/**
	 * @param {number|BigNumber} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		bytebuffer.writeUint64(BigNumber.isBigNumber(value) ? BigNumberToLong(value, true) : value);
	}

}

export default new Uint64Type();
