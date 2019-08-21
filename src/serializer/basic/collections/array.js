import Serializable from '../../serializable';

/** @typedef {import("bytebuffer")} ByteBuffer */

/**
 * @template {Serializable} T
 * @typedef {Parameters<T['toRaw']>[0][]} TInput
 */

/**
 * @template {Serializable} T
 * @typedef {ReturnType<T['toRaw']>[]} TOutput
 */

/**
 * @template {Serializable} T
 * @augments {Serializable<TInput<T>, TOutput<T>>}
 */
class ArrayType extends Serializable {

	/**
	 * @readonly
	 * @type {T}
	 */
	get type() { return this._type; }

	/** @param {T} type */
	constructor(type) {
		super();
		if (!(type instanceof Serializable)) throw new Error('invalid array elements type');
		/**
		 * @private
		 * @type {T}
		 */
		this._type = type;
	}

	/**
	 * @param {TInput<T>} value
	 * @returns {TOutput<T>}
	 */
	toRaw(value) {
		if (!Array.isArray(value)) throw new Error('value is not an array');
		const result = new Array(value.length);
		for (let i = 0; i < value.length; i += 1) {
			try {
				const element = value[i];
				result[i] = this.type.toRaw(element);
			} catch (error) {
				throw new Error(`array element with index ${i}: ${error.message}`);
			}
		}
		return result;
	}

	/**
	 * @param {TInput<T>} value
	 * @param {ByteBuffer} bytebuffer
	 * @param {boolean} [writeLength]
	 */
	appendToByteBuffer(value, bytebuffer, writeLength = true) {
		if (typeof writeLength !== 'boolean') throw new Error('property "writeLength" is not a boolean');
		const raw = this.toRaw(value);
		// TODO: sortOperation
		if (writeLength) bytebuffer.writeVarint32(raw.length);
		for (const element of raw) this.type.appendToByteBuffer(element, bytebuffer);
	}

}

/**
 * @template {Serializable} T
 * @param {T} type
 * @returns {ArrayType<T>}
 */
export default function array(type) { return new ArrayType(type); }
export { ArrayType };
