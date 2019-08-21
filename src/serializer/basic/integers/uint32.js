import BigNumber from 'bignumber.js';
import UIntType from './uint';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @augments {UIntType<number>} */
export class UInt32Type extends UIntType {

	constructor() { super(32); }

	/**
	 * @param {Parameters<UInt32Type['toRaw']>[0]} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		bytebuffer.writeUint32(raw);
	}

}

const uint32 = new UInt32Type();
export default uint32;
