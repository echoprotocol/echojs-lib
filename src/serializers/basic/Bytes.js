import ISerializer from '../ISerializer';
import { varint32 } from './integers';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @typedef {Buffer | string} TInput */

/** @augments {ISerializer<TInput, string>} */
export default class BytesSerializer extends ISerializer {

	/**
	 * @readonly
	 * @type {number | undefined}
	 */
	get bytesCount() { return this._bytesCount; }

	/** @param {number} [bytesCount] */
	constructor(bytesCount) {
		super();
		if (bytesCount !== undefined) {
			try {
				if (bytesCount < 0) throw new Error('bytes serializer size is negative');
				/**
				 * @private
				 * @type {number | undefined}
				 */
				this._bytesCount = varint32.toRaw(bytesCount);
			} catch (error) {
				throw new Error(`bytes serializer length: ${error.message}`);
			}
		}
	}

	/**
	 * @param {TInput} value
	 * @returns {string}
	 */
	toRaw(value) {
		if (typeof value === 'string') {
			if (!/^([\da-fA-F]{2})*$/.test(value)) throw new Error('invalid hex format');
			value = Buffer.from(value.toLowerCase(), 'hex');
		} else if (!Buffer.isBuffer(value)) throw new Error('invalid bytes type');
		if (this.bytesCount !== undefined && value.length !== this.bytesCount) throw new Error('invalid bytes count');
		return value.toString('hex');
	}

	/**
	 * @param {TInput} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		if (this.bytesCount === undefined) varint32.appendToByteBuffer(raw.length / 2, bytebuffer);
		bytebuffer.append(Buffer.from(raw, 'hex').toString('binary'), 'binary');
	}

	/**
	 * @param {buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: string, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		const lengthIsStatic = this.bytesCount !== undefined;
		const { res: length, newOffset: from } = lengthIsStatic ?
			{ res: this.bytesCount, newOffset: offset } :
			varint32.readFromBuffer(buffer, offset);
		const bytes = buffer.slice(from, from + length);
		if (bytes.length !== length) throw new Error('unexpected end of buffer');
		return { res: this.toRaw(bytes), newOffset: from + length };
	}

}
