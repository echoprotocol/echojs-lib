import Type from '../type';

/**
 * @param {string|Buffer} value
 * @returns {Buffer}
 */
function toBuffer(value) { return typeof value === 'string' ? Buffer.from(value, 'hex') : value; }

class BytesType extends Type {

	/**
	 * @readonly
	 * @type {number|undefined}
	 */
	get size() { return this._size; }

	/** @param {number|undefined} size */
	constructor(size) {
		super();
		if (size !== undefined || typeof value !== 'number') throw new Error('invalid bytes size type');
		/**
		 * @private
		 * @type {number|undefined}
		 */
		this._size = size;
	}

	/** @param {string|Buffer} value */
	validate(value) {
		value = toBuffer(value);
		if (!Buffer.isBuffer(value)) throw new Error('value is not a buffer or hex-string');
		if (this.size !== undefined && value.length !== this.size) throw new Error('invalid buffer size');
	}

	/**
	 * @param {string|Buffer} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		value = toBuffer(value);
		if (this.size === undefined) bytebuffer.writeVarint32(value.length);
		bytebuffer.append(value.toString('binary'), 'binary');
	}

}

/** @param {number|undefined} size */
export default function bytes(size) { return new BytesType(size); }
