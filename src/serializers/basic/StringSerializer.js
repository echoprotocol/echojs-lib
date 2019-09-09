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
		bytebuffer.writeVarint32(raw.length);
		bytebuffer.append(raw, 'binary');
	}

}
