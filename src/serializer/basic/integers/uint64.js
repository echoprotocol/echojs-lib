import BigNumber from 'bignumber.js';
import UIntType from './uint';
import { BigNumberToLong } from '../../../utils/converters';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @augments {UIntType<string>} */
export class UInt64Type extends UIntType {

	constructor() { super(64); }

	/**
	 * @param {Parameters<UInt64Type['toRaw']>[0]} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		bytebuffer.writeUint64(BigNumberToLong(new BigNumber(raw)));
	}

}

const uint64 = new UInt64Type();
export default uint64;
