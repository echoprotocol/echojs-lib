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

/** @typedef {{ [key: string]: ISerializer }} SerializersMap */

/**
 * @template {SerializersMap} T
 * @template {keyof T} TKey
 * @typedef {SerializerInput<T[TKey]>} TInput
 */

/**
 * @template {SerializersMap} T
 * @template {keyof T} TKey
 * @typedef {SerializerOutput<T[TKey]>} TOutput
 */

/**
 * @template {SerializersMap} T
 * @augments {ISerializer<TInput<T>, TOutput<T>>}
 */
export default class StructSerializer extends ISerializer {

	/**
	 * @readonly
	 * @type {Readonly<T>}
	 */
	get serializers() { return this._serializers; }

	/** @param {Readonly<T>} serializers */
	constructor(serializers) {
		if (typeof serializers !== 'object' || serializers === null) {
			throw new Error('property "serializers" is not a object');
		}
		for (const key in serializers) {
			if (!Object.prototype.hasOwnProperty.call(serializers, key)) continue;
			const serializer = serializers[key];
			if (!(serializer instanceof ISerializer)) {
				throw new Error(`field "${key}" is not a serializer`);
			}
		}
		super();
		/**
		 * @private
		 * @type {Object<string,Type>}
		 */
		this._serializers = serializers;
	}

	/**
	 * @template {keyof T} TKey
	 * @param {TInput<T, TKey>} value
	 * @returns {TOutput<T, TKey>}
	 */
	toRaw(value) {
		if (typeof value !== 'object' || value === null) throw new Error('serializable struct is not a object');
		/** @type {TOutput<T, TKey>} */
		const result = {};
		for (const key in this.serializers) {
			if (!Object.prototype.hasOwnProperty.call(this.serializers, key)) continue;
			const serializer = this.serializers[key];
			try {
				result[key] = serializer.toRaw(value[key]);
			} catch (error) {
				throw new Error(`struct key "${key}": ${error.message}`);
			}
		}
		return result;
	}

	/**
	 * @template {keyof T} TKey
	 * @param {TInput<T, TKey>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		for (const key in this.serializers) {
			if (!Object.prototype.hasOwnProperty.call(this.serializers, key)) continue;
			const serializer = this.serializers[key];
			serializer.appendToByteBuffer(raw[key], bytebuffer);
		}
	}

}
