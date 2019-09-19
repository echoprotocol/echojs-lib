import { varint32 } from './integers';
import ISerializer from '../ISerializer';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @augments {ISerializer<string, string>} */
export default class StringSerializer extends ISerializer {

	/**
	 * @param {string} value
	 * @returns {string}
	 */
	toRaw(value) {
		if (typeof value !== 'string') throw new Error('value is not a string');
		return value;
	}

	/**
	 * @param {string} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		varint32.appendToByteBuffer(raw.length, bytebuffer);
		bytebuffer.append(raw, 'binary');
	}

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: string, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		const { res: length, newOffset: from } = varint32.readFromBuffer(buffer, offset);
		const bytes = buffer.slice(from, from + length);
		return { res: this.toRaw(bytes.toString()), newOffset: from + length };
	}

}
