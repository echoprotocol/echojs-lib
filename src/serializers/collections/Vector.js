import ISerializer from '../ISerializer';
import { varint32 } from '../basic/integers';

/** @typedef {import("bytebuffer")} ByteBuffer */

/**
 * @template {ISerializer} T
 * @typedef {import("../ISerializer").SerializerInput<T>} SerializerInput
 */

/**
 * @template {ISerializer} T
 * @typedef {import("../ISerializer").SerializerOutput<T>} SerializerOutput
 */

/**
 * @template {ISerializer} T
 * @typedef {SerializerInput<T>[]} TInput
 */

/**
 * @template {ISerializer} T
 * @augments {ISerializer<TInput<T>, TOutput<T>>}
 */
export default class VectorSerializer extends ISerializer {

	/**
	 * @readonly
	 * @type {T}
	 */
	get serializer() { return this._serializer; }

	/** @param {T} serializer */
	constructor(serializer) {
		super();
		if (!(serializer instanceof ISerializer)) throw new Error('vector element type is not serializer');
		/**
		 * @private
		 * @type {T}
		 */
		this._serializer = serializer;
	}

	/**
	 * @param {TInput<T>} value
	 * @returns {TOutput<T>}
	 */
	toRaw(value) {
		if (!Array.isArray(value)) throw new Error('value is not an array');
		const raw = new Array(value.length);
		for (let i = 0; i < value.length; i += 1) {
			try {
				const element = value[i];
				raw[i] = this.serializer.toRaw(element);
			} catch (error) {
				throw new Error(`vector element with index ${i}: ${error.message}`);
			}
		}
		return raw;
	}

	/**
	 * @param {TInput<T>} value
	 * @param {ByteBuffer} bytebuffer
	 * @param {boolean} writeLength
	 */
	appendToByteBuffer(value, bytebuffer, writeLength = true) {
		if (typeof writeLength !== 'boolean') throw new Error('property "writeLength" is not a boolean');
		const raw = this.toRaw(value);
		if (writeLength) varint32.appendToByteBuffer(raw.length, bytebuffer);
		for (const element of raw) this.serializer.appendToByteBuffer(element, bytebuffer);
	}

}