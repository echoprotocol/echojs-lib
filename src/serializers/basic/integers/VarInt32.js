import BigNumber from 'bignumber.js';
import IIntSerializer from './IIntSerializer';

/** @typedef {import("bytebuffer")} ByteBuffer */
/** @typedef {import("../../ISerializer").default} ISerializer */

/**
 * @template {ISerializer} T
 * @typedef {import("../../ISerializer").SerializerInput<T>} SerializerInput
 */

/** @augments {IIntSerializer<number>} */
export default class VarInt32Serializer extends IIntSerializer {

	constructor() { super(32); }

	/**
	 * @param {SerializerInput<VarInt32Serializer>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		if (raw < 0) throw new Error('negative varint32 serialization is not implemented');
		bytebuffer.writeVarint32(raw);
	}

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: number, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		let result = new BigNumber(0);
		let multiplier = new BigNumber(1);
		let newOffset = offset;
		while (true) {
			const byte = buffer.readUInt8(newOffset);
			const isEnd = byte < 0x80;
			result = result.plus(new BigNumber(byte - (isEnd ? 0 : 0x80)).times(multiplier));
			multiplier = multiplier.times(2 ** 7);
			newOffset += 1;
			if (isEnd) break;
		}
		return { res: this.toRaw(result), newOffset };
	}

}
