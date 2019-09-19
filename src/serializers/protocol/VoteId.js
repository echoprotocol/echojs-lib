import { uint32 } from '../basic/integers';
import ISerializer from '../ISerializer';
import { validateUnsignedSafeInteger } from '../../utils/validators';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @typedef {string | { type: number, id: number }} TInput */
/** @typedef {string} TOutput */

/** @augments {ISerializer<TInput, TOutput>} */
export default class VoteIdSerializer extends ISerializer {

	/**
	 * @param {TInput} value
	 * @returns {TOutput}
	 */
	toRaw(value) {
		if (typeof value === 'string') {
			if (!/^\d+:\d+$/.test(value)) throw new Error('invalid voteId format');
			const [type, id] = value.split(':').map((str) => Number.parseInt(str, 10));
			value = { type, id };
		} else if (typeof value !== 'object' || value === null) throw new Error('invalid voteId type');
		const { type, id } = value;
		validateUnsignedSafeInteger(type, 'vote type');
		validateUnsignedSafeInteger(id, 'vote id');
		if (type > 0xff) throw new Error('invalid type');
		if (id > 0xffffff) throw new Error('invalid id');
		return `${type}:${id}`;
	}

	/**
	 * @param {TInput} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const [type, id] = this.toRaw(value).split(':').map((str) => Number.parseInt(str, 10));
		// eslint-disable-next-line no-bitwise
		uint32.appendToByteBuffer((id << 8) | type, bytebuffer);
	}

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: TOutput, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		const { res: num, newOffset } = uint32.readFromBuffer(buffer, offset);
		// eslint-disable-next-line no-bitwise
		const [type, id] = [num % 0x100, num >> 8];
		return { res: this.toRaw({ type, id }), newOffset };
	}

}
