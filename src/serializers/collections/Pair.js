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
 * @template {ISerializer} TFirst
 * @template {ISerializer} TSecond
 * @typedef {[SerializerInput<TFirst>, SerializerInput<TSecond>]} TInput
 */

/**
 * @template {ISerializer} TFirst
 * @template {ISerializer} TSecond
 * @typedef {[SerializerOutput<TFirst>, SerializerOutput<TSecond>]} TOutput
 */

/**
 * @template {ISerializer} TFirst
 * @template {ISerializer} TSecond
 * @augments {ISerializer<TInput<TFirst, TSecond>, TOutput<TFirst, TSecond>>}
 */
export default class PairSerializer extends ISerializer {

	get firstSerializer() { return this._firstSerializer; }
	get secondSerializer() { return this._secondSerializer; }

	/**
	 * @param {TFirst} firstSerializer
	 * @param {TSecond} secondSerializer
	 */
	constructor(firstSerializer, secondSerializer) {
		if (!(firstSerializer instanceof ISerializer)) throw new Error('key is not serializer');
		if (!(firstSerializer instanceof ISerializer)) throw new Error('value is not serializer');
		super();
		/**
		 * @private
		 * @type {TFirst}
		 */
		this._firstSerializer = firstSerializer;
		/**
		 * @private
		 * @type {TSecond}
		 */
		this._secondSerializer = secondSerializer;
	}

	/**
	 * @param {TInput<TFirst, TSecond>} value
	 * @returns {TOutput<TFirst, TSecond>}
	 */
	toRaw(value) {
		const raw = new Array(2);
		try {
			raw[0] = this.firstSerializer.toRaw(value[0]);
		} catch (error) {
			throw new Error(`pair[0]: ${error.message}`);
		}
		try {
			raw[1] = this.secondSerializer.toRaw(value[1]);
		} catch (error) {
			throw new Error(`pair[1]: ${error.message}`);
		}
		return raw;
	}

	/**
	 * @param {TInput<TFirst, TSecond>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		this.firstSerializer.appendToByteBuffer(raw[0], bytebuffer);
		this.secondSerializer.appendToByteBuffer(raw[1], bytebuffer);
	}

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: TOutput<TFirst, TSecond>, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		const {
			res: firstElement,
			newOffset: intermediateOffset,
		} = this.firstSerializer.readFromBuffer(buffer, offset);
		const { res: secondElement, newOffset } = this.secondSerializer.readFromBuffer(buffer, intermediateOffset);
		return { res: [firstElement, secondElement], newOffset };
	}

}
