import ISerializer from '../ISerializer';
import { uint8 } from './integers';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @typedef {boolean} TInput */
/** @typedef {boolean} TOutput */

/** @augments {ISerializer<TInput, TOutput>} */
export default class BoolSerializer extends ISerializer {

	/**
	 * @param {TInput} value
	 * @returns {TOutput}
	 */
	toRaw(value) {
		if (typeof value !== 'boolean') throw new Error('invalid bool type');
		return value;
	}

	/**
	 * @param {TInput} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		uint8.appendToByteBuffer(raw ? 1 : 0, bytebuffer);
	}

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: TOutput, newOffset: number }}
	 */
	readFromBuffer(buffer, offset) {
		const newOffset = offset + 1;
		const byte = buffer[offset];
		if (byte > 0x01) throw new Error('invalid bool byte');
		return { res: byte === 0x01, newOffset };
	}

}
