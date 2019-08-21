import UIntType from './uint';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @augments {UIntType<number>} */
export class UInt8Type extends UIntType {

	constructor() { super(8); }

	/**
	 * @param {Parameters<UInt8Type['toRaw']>[0]} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		bytebuffer.writeUint8(raw);
	}

}

const uint8 = new UInt8Type();
export default uint8;
