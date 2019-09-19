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
 * @typedef {{ [key in keyof T]: SerializerInput<T[key]> }} TInput
 */

/**
 * @template {SerializersMap} T
 * @typedef {{ [key in keyof T]: SerializerOutput<T[key]> }} TOutput
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
	 * @param {TInput<T>} value
	 * @returns {TOutput<T>}
	 */
	toRaw(value) {
		if (typeof value !== 'object' || value === null) throw new Error('serializable struct is not a object');
		/** @type {TOutput<T>} */
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
	 * @param {TInput<T>} value
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

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: TOutput<T>, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		const result = {};
		let it = offset;
		for (const key in this.serializers) {
			if (!Object.prototype.hasOwnProperty.call(this.serializers, key)) continue;
			const serializer = this.serializers[key];
			const { res: element, newOffset } = serializer.readFromBuffer(buffer, it);
			it = newOffset;
			result[key] = element;
		}
		return { res: result, newOffset: it };
	}

}
