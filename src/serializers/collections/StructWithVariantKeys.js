import ISerializer from '../ISerializer';
import { staticVariant } from '.';

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

/** @typedef {{ [key: string]: ISerializer | ISerializer[] }} SerializersMapWithVariants */

/** @typedef {{
 * 	keyIndexInStructure: number,
 * 	serializersData: [string, ISerializer][],
 * }} ExtraSerializer
 */

/** @typedef {ExtraSerializer[]} ExtraSerializers

/** @typedef {ExtraSerializer['serializersData'][number][0]} ExtraSerializerKey

/**
 * @template {SerializersMap} T
 * @template {ExtraSerializers} V
 * @typedef {{
 * 	[key in keyof T]: SerializerInput<T[key]
 *  & { [key in ExtraSerializerKey]: SerializerInput<V[number]['serializersData'][number][1]>>
 * }} TInput
 */

/**
 * @template {SerializersMap} T
 * @template {ExtraSerializers} V
 * @typedef {{
 * 	[key in keyof T]: SerializerOutput<T[key]
 * 	& { [key in ExtraSerializerKey]: SerializerInput<V[number]['serializersData'][number][1]>>
 * }} TOutput
 */

/**
 * @template {SerializersMap} T
 * @template {ExtraSerializers} V
 * @augments {ISerializer<TInput<T, V>, TOutput<T, V>>}
 */
export default class StructWithVariantKeysSerializer extends ISerializer {

	/**
	 * @readonly
	 * @type {Readonly<T>}
	 */
	get serializers() { return this._serializers; }

	/**
	 * @readonly
	 * @type {Readonly<V>}
	 */
	get extraSerializers() { return this._extraSerializers; }

	/**
	 * @param {Readonly<T>} serializers
	 * @param {Readonly<V>} extraSerializers
	 */
	constructor(serializers, extraSerializers) {
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
		this._extraSerializers = extraSerializers.sort((el1, el2) => el1.keyIndexInStructure - el2.keyIndexInStructure);
	}

	/**
	 * @param {TInput<T, V>} value
	 * @param {[string, ISerializer][]} serializersData
	 * @returns {[string, number]}
	 */
	findSerializerKeyInVariant(value, serializersData) {
		let variantKey;
		let index;
		for (let i = 0; i < serializersData.length; i += 1) {
			const currentKey = serializersData[i][0];
			if (value[currentKey]) {
				variantKey = currentKey;
				index = i;
				break;
			}
		}
		return [variantKey, index];
	}

	/**
	 * @param {TInput<T, V>} value
	 * @returns {TOutput<T, V>}
	 */
	toRaw(value) {
		if (typeof value !== 'object' || value === null) throw new Error('serializable struct is not a object');
		/** @type {TOutput<T>} */
		const result = {};
		let iterator = 0;
		const serializersKeys = Object.keys(this.serializers);
		for (let i = 0; i < serializersKeys.length + this.extraSerializers.length; i += 1) {
			// eslint-disable-next-line no-loop-func
			const variantKeySerializer = this.extraSerializers.find((el) => el.keyIndexInStructure === iterator);
			if (variantKeySerializer) {
				const { serializersData } = variantKeySerializer;
				const [variantKey, index] = this.findSerializerKeyInVariant(value, serializersData);
				const [rawKey, rawValue] = staticVariant(variantKeySerializer.serializersData.map((el) => el[1]))
					.toRaw([index, value[variantKey]]);
				const resultKey = variantKeySerializer.serializersData[rawKey][0];
				result[resultKey] = rawValue;
				iterator += 1;
			}

			if (i >= serializersKeys.length) {
				iterator += 1;
				continue;
			}
			const key = serializersKeys[i];
			if (!Object.prototype.hasOwnProperty.call(this.serializers, key)) continue;
			const serializer = this.serializers[key];
			try {
				result[key] = serializer.toRaw(value[key]);
			} catch (error) {
				throw new Error(`struct key "${key}": ${error.message}`);
			}
			iterator += 1;
		}
		return result;
	}

	/**
	 * @param {TInput<T, V>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		let iterator = 0;
		const serializersKeys = Object.keys(this.serializers);
		for (let i = 0; i < serializersKeys.length + this.extraSerializers.length; i += 1) {
			// eslint-disable-next-line no-loop-func
			const variantKeySerializer = this.extraSerializers.find((el) => el.keyIndexInStructure === iterator);
			if (variantKeySerializer) {
				const { serializersData } = variantKeySerializer;
				const [variantKey, index] = this.findSerializerKeyInVariant(value, serializersData);
				staticVariant(variantKeySerializer.serializersData.map((el) => el[1]))
					.appendToByteBuffer([index, value[variantKey]], bytebuffer);
				iterator += 1;
			}

			if (i >= serializersKeys.length) {
				iterator += 1;
				continue;
			}
			const key = serializersKeys[i];
			if (!Object.prototype.hasOwnProperty.call(this.serializers, key)) continue;
			const serializer = this.tserializers[key];
			serializer.appendToByteBuffer(raw[key], bytebuffer);
			iterator += 1;
		}
	}

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: TOutput<T, V>, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		const result = {};
		let it = offset;
		let iterator = 0;
		const serializersKeys = Object.keys(this.serializers);
		for (let i = 0; i < serializersKeys.length + this.extraSerializers.length; i += 1) {

			// eslint-disable-next-line no-loop-func
			const variantKeySerializer = this.extraSerializers.find((el) => el.keyIndexInStructure === iterator);
			if (variantKeySerializer) {
				const { res, newOffset } = staticVariant(variantKeySerializer.serializersData.map((el) => el[1]))
					.readFromBuffer(buffer, it);
				it = newOffset;
				const [rawKey, variant] = res;
				const resultKey = variantKeySerializer.serializersData[rawKey][0];
				result[resultKey] = variant;
				iterator += 1;
			}
			if (i >= serializersKeys.length) {
				iterator += 1;
				continue;
			}
			const key = serializersKeys[i];
			const serializer = this.serializers[key];
			if (!Object.prototype.hasOwnProperty.call(this.serializers, key)) continue;
			const { res: element, newOffset } = serializer.readFromBuffer(buffer, it);
			it = newOffset;
			result[key] = element;
			iterator += 1;
		}
		return { res: result, newOffset: it };
	}

}
