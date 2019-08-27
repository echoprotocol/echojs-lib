import { uint8 } from '../basic/integers';
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
		return this.serializer.toRaw(value);
	}

	/**
	 * @param {TInput<T>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		uint8.appendToByteBuffer(raw === undefined ? 0 : 1);
		this.serializer.appendToByteBuffer(raw, bytebuffer);
	}

}
