import IntType from './int';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @augments {IntType<number>} */
export class Varint32Type extends IntType {

	constructor() { super(32); }

	/**
	 * @param {Parameters<Varint32Type['toRaw']>[0]} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		bytebuffer.writeVarint32(raw);
	}

}

const varint32 = new Varint32Type();
export default varint32;
