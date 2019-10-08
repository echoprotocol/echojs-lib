import { bool } from '../basic';
import ISerializer from '../ISerializer';

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
 * @typedef {undefined | SerializerInput<T>} TInput
 */

/**
 * @template {ISerializer} T
 * @typedef {undefined | SerializerOutput<T>} TOutput
 */

/**
 * @template {ISerializer} T
 * @augments {ISerializer<TInput<T>, TOutput<T>>}
 */
export default class OptionalSerializer extends ISerializer {

	/**
	 * @readonly
	 * @type {T}
	 */
	get serializer() { return this._serializer; }

	/** @param {T} serializer */
	constructor(serializer) {
		super();
		/**
		 * @private
		 * @type {T}
		 */
		this._serializer = serializer;
	}

	/**
	 * @template {boolean} TProvided
	 * @param {TProvided extends true ? SerializerInput<T> : undefined} value
	 */
	toRaw(value) {
		if (value === undefined) return undefined;
		try {
			return this.serializer.toRaw(value);
		} catch (error) {
			throw new Error(`optional type: ${error.message}`);
		}
	}

	/**
	 * @param {TInput<T>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		bool.appendToByteBuffer(raw !== undefined, bytebuffer);
		if (raw !== undefined) this.serializer.appendToByteBuffer(raw, bytebuffer);
	}

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: TOutput<T>, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		const { res: isProvided, newOffset: from } = bool.readFromBuffer(buffer, offset);
		if (!isProvided) return { res: undefined, newOffset: from };
		return this.serializer.readFromBuffer(buffer, from);
	}

}
