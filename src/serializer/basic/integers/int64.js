import BigNumber from 'bignumber.js';
import IntType from './int';
import { BigNumberToLong } from '../../../utils/converters';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @augments {IntType<string>} */
export class Int64Type extends IntType {

	constructor() { super(64); }

	/**
	 * @param {Parameters<Int64Type['toRaw']>[0]} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		bytebuffer.writeInt64(BigNumberToLong(new BigNumber(raw)));
	}

}

const int64 = new Int64Type();
export default int64;
