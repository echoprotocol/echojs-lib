import ISerializer from '../ISerializer';
import { varint32 } from '../basic/integers';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @typedef {import("../basic/integers/VarInt32").default} VarInt32Serializer */

/**
 * @template {ISerializer} T
 * @typedef {import("../ISerializer").SerializerInput<T>} SerializerInput
 */

/**
 * @template {ISerializer} T
 * @typedef {import("../ISerializer").SerializerOutput<T>} SerializerOutput
 */

/** @typedef {{ [key: number]: ISerializer }} Variants */

/**
 * @template {Variants} T
 * @template {number} TVariant
 * @typedef {[TVariant, TVariant extends keyof T ? SerializerInput<T[TVariant]> : never]} TInput
 */

/**
 * @template {Variants} T
 * @template {number} TVariant
 * @typedef {[TVariant, TVariant extends keyof T ? SerializerOutput<T[TVariant]> : never]} TOutput
 */

/**
 * @template {Variants} T
 * @augments {ISerializer<TInput<T, number>, TOutput<T, number>>}
 */
export default class StaticVariantSerializer extends ISerializer {

	/**
	 * @readonly
	 * @type {Readonly<T>}
	 */
	get serializers() { return { ...this._serializers }; }

	/** @param {Readonly<T>} serializers */
	constructor(serializers) {
		super();
		if (!serializers || typeof serializers !== 'object') throw new Error('types variable is not an object');
		for (const key in serializers) {
			if (!Object.prototype.hasOwnProperty.call(serializers, key)) continue;
			try {
				varint32.validate(key);
			} catch (error) {
				throw new Error(`invalid key ${key}: ${error.message}`);
			}
			const serializer = serializers[key];
			if (!(serializer instanceof ISerializer)) throw new Error(`variant with key ${key} is not a serializer`);
		}
		/**
		 * @private
		 * @type {Readonly<T>}
		 */
		this._serializers = { ...serializers };
	}

	/**
	 * @template {number} TVariant
	 * @param {TInput<T, TVariant>} value
	 * @returns {TOutput<T, TVariant>}
	 */
	toRaw(value) {
		if (!Array.isArray(value)) throw new Error('value is not an array');
		const [key, variant] = value;
		/** @type {SerializerOutput<VarInt32Serializer>} */
		let rawKey;
		try {
			rawKey = varint32.toRaw(key);
		} catch (error) {
			throw new Error(`static variant invalid key: ${error.message}`);
		}
		const serializer = this.serializers[rawKey];
		if (!serializer) throw new Error(`serializer with key ${rawKey} not found`);
		try {
			return [rawKey, serializer.toRaw(variant)];
		} catch (error) {
			throw new Error(`static variant with key ${rawKey}: ${error.message}`);
		}
	}

	/**
	 * @template {number} TVariant
	 * @param {TInput<T, TVariant>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const [key, variant] = this.toRaw(value);
		varint32.appendToByteBuffer(key, bytebuffer);
		const serializer = this.serializers[key];
		serializer.appendToByteBuffer(variant, bytebuffer);
	}

	/**
	 * @template {number} TVariant
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: TOutput<T, TVariant>, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		const { res: key, newOffset: from } = varint32.readFromBuffer(buffer, offset);
		const serializer = this.serializers[key];
		if (!serializer) throw new Error(`serializer with key ${key} not found`);
		const { res: variant, newOffset } = serializer.readFromBuffer(buffer, from);
		return { res: [key, variant], newOffset };
	}

}
