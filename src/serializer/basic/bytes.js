import Serializable from '../serializable';

/** @typedef {import("bytebuffer")} ByteBuffer */
/** @typedef {Buffer | string} TInput */

/** @augments {Serializable<TInput, string>} */
class BytesType extends Serializable {

	/**
	 * @readonly
	 * @type {number | undefined}
	 */
	get size() { return this._size; }

	/** @param {number} [size] */
	constructor(size) {
		super();
		if (size !== undefined && typeof size !== 'number') throw new Error('invalid bytes size type');
		if (!Number.isInteger(size)) throw new Error('bytes size is not a integer');
		if (size < 0) throw new Error('bytes size is negative');
		if (size >= 2 ** 32) throw new Error('bytes size overflow');
		/**
		 * @private
		 * @type {number | undefined}
		 */
		this._size = size;
	}

	/**
	 * @param {TInput} value
	 * @returns {string}
	 */
	toRaw(value) {
		if (typeof value === 'string') {
			if (!/^[\da-fA-F]$/.test(value)) throw new Error('invalid hex value');
			if (this.size !== undefined && value.length !== this.size * 2) throw new Error('invalid hex length');
			return value.toLowerCase();
		}
		if (value.length !== this.size) throw new Error('invalid buffer length');
		return value.toString('hex');
	}

	/**
	 * @param {TInput} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		if (this.size === undefined) bytebuffer.writeVarint32(value.length);
		bytebuffer.append(Buffer.from(raw, 'hex').toString('binary'), 'binary');
	}

}

/**
 * @param {number} [size]
 * @returns {BytesType}
 */
export default function bytes(size) { return new BytesType(size); }
