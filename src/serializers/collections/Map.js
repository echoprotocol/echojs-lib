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
 * @template {ISerializer} TKey
 * @template {ISerializer} TValue
 * @typedef {[SerializerInput<TKey>, SerializerOutput<TValue>][]} TNativeInput */

/**
 * @template {ISerializer} TKey
 * @template {ISerializer} TValue
 * @typedef {Map<SerializerInput<TKey>, SerializerOutput<TValue>> | TNativeInput<TKey, TValue>} TStrictInput
 */

/**
 * @template {ISerializer} TKey
 * @template {ISerializer} TValue
 * @typedef {TStrictInput<TKey, TValue> | { [key: string]: SerializerInput<TValue> }} TExtendedInput
 */

/**
 * @template {ISerializer} TKey
 * @template {ISerializer} TValue
 * @typedef {string extends SerializerInput<TKey> ? TExtendedInput<TKey, TValue> : TStrictInput<TKey, TValue>} TInput
 */

/**
 * @template {ISerializer} TKey
 * @template {ISerializer} TValue
 * @typedef {[SerializerOutput<TKey>, SerializerOutput<TValue>][]} TOutput
 */

/**
 * @template {ISerializer} TKey
 * @template {ISerializer} TValue
 * @augments {ISerializer<TInput<TKey, TValue>, TOutput<TKey, TValue>>}
 */
export default class MapSerializer extends ISerializer {

	/**
	 * @readonly
	 * @type {TKey}
	 */
	get keySerializer() { return this._keySerializer; }

	/**
	 * @readonly
	 * @type {TValue}
	 */
	get valueSerializer() { return this._valueSerializer; }

	/**
	 * @param {TKey} keySerializer
	 * @param {TValue} valueSerializer
	 */
	constructor(keySerializer, valueSerializer) {
		if (!(keySerializer instanceof ISerializer)) throw new Error('key is not serializer');
		if (!(valueSerializer instanceof ISerializer)) throw new Error('value is not serializer');
		super();
		/**
		 * @private
		 * @type {TKey}
		 */
		this._keySerializer = keySerializer;
		/**
		 * @private
		 * @type {TValue}
		 */
		this._valueSerializer = valueSerializer;
	}

	/**
	 * @param {TInput<TKey, TValue>} value
	 * @returns {TOutput<TKey, TValue>}
	 */
	toRaw(value) {
		/** @type {TNativeInput<TKey, TValue>} */
		let entries;
		if (value instanceof Map) entries = [...value.entries()];
		else if (!Array.isArray(value)) {
			if (typeof value !== 'object') throw new Error('invalid map value');
			entries = Object.keys(value).map((key) => [key, value[key]]);
		} else entries = value;
		/** @type {Set<string>} */
		const serializedKeys = new Set();
		const raw = new Array(entries.length);
		for (let i = 0; i < entries.length; i += 1) {
			const element = entries[i];
			if (!Array.isArray(element)) throw new Error('element of a value is not an array');
			if (element.length !== 2) throw new Error('expected 2 subelements (key and value)');
			const [key, elementValue] = element;

			let keyBuffer;
			try {
				keyBuffer = this.keySerializer.serialize(key);
			} catch (error) {
				throw new Error(`key of map at element with index ${i}: ${error}`);
			}
			if (serializedKeys.has(keyBuffer)) throw new Error('keys duplicates');
			serializedKeys.add(keyBuffer);

			try {
				raw[i] = [this.keySerializer.toRaw(key), this.valueSerializer.toRaw(elementValue)];
			} catch (error) {
				throw new Error(`value of map at element with index ${i}: ${error}`);
			}
		}

		raw.sort((mapItemOne, mapItemTwo) => {
			const [keyA] = mapItemOne;
			const [keyB] = mapItemTwo;

			const keyAhex = this.keySerializer.serialize(keyA).toString('hex');
			const keyBhex = this.keySerializer.serialize(keyB).toString('hex');

			if (keyAhex.length < keyBhex.length || keyAhex.length > keyBhex.length) {
				throw new Error('public keys are different in lengths');
			}

			if (keyAhex < keyBhex) return -1;
			if (keyAhex > keyBhex) return 1;
			return 0;
		});

		return raw;
	}

	/**
	 * @param {TInput<TKey, TValue>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		varint32.appendToByteBuffer(raw.length, bytebuffer);
		for (const [key, element] of raw) {
			this.keySerializer.appendToByteBuffer(key, bytebuffer);
			this.valueSerializer.appendToByteBuffer(element, bytebuffer);
		}
	}

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: TOutput<TKey, TValue> newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		const { res: length, newOffset: from } = varint32.readFromBuffer(buffer, offset);
		const result = new Array(length).fill(null);
		let it = from;
		for (let i = 0; i < length; i += 1) {
			const keyDeserialization = this.keySerializer.readFromBuffer(buffer, it);
			it = keyDeserialization.newOffset;
			const key = keyDeserialization.res;
			const valueDeserialization = this.valueSerializer.readFromBuffer(buffer, it);
			it = valueDeserialization.newOffset;
			const value = valueDeserialization.res;
			result[i] = [key, value];
		}
		return { res: this.toRaw(result), newOffset: it };
	}

}
