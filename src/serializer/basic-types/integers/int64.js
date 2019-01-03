import BigNumber from 'bignumber.js';
import IntType from './int';
import { BigNumberToLong } from '../../../utils/converters';

class Int64Type extends IntType {

	constructor() {
		super(64);
	}

	/**
	 * @param {number|BigNumber} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		bytebuffer.writeInt64(BigNumber.isBigNumber(value) ? BigNumberToLong(value) : value);
	}

}

const int64 = new Int64Type();

export default int64;
