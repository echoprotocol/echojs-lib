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

	/**
	 * @override
	 * @param {number|string|BigNumber} value
	 * @returns {string}
	 */
	toObject(value) {
		return this.validate(value).toString();
	}

}

export default new Int64Type();
