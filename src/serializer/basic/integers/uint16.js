import BigNumber from 'bignumber.js';
import UIntType from './uint';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @augments {UIntType<number>} */
export class UInt16Type extends UIntType {

	constructor() { super(16); }

	/**
	 * @param {Parameters<UInt16Type['toRaw']>[0]} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		bytebuffer.writeUint16(raw);
	}

}

const uint16 = new UInt16Type();
export default uint16;
