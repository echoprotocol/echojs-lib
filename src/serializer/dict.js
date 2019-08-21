import Serializable from './serializable';

/**
 * @template T
 * @typedef {import("../../types/__helpers").UndefinedOptional<T>} UndefinedOptional
 */

/** @typedef {{ [key: string]: Serializable }} Types */

/**
 * @template {Types} T
 * @typedef {UndefinedOptional<{ [key in keyof T]: Parameters<T[key]['validate']>[0] }>} TInput
 */

/**
 * @template {Types} T
 * @typedef {UndefinedOptional<{ [key in keyof T]: ReturnType<T[key]['toRaw']> }>} TOutput
 */

/**
 * @template {Types} T
 * @augments {Serializable<TInput<T>, TOutput<T>>}
 */
class Dict extends Serializable {

	/**
	 * @readonly
	 * @type {T}
	 */
	get types() { return { ...this._types }; }

	/** @param {T} types */
	constructor(types) {
		if (typeof types !== 'object' || types === null) throw new Error('property "types" is not a object');
		for (const key in types) {
			if (!Object.prototype.hasOwnProperty.call(types, key)) continue;
			const type = types[key];
			if (!(type instanceof Serializable)) {
				throw new Error(`type of field "${key}" is not a instance of Serializable class`);
			}
		}
		super();
		/**
		 * @private
		 * @type {T}
		 */
		this._types = types;
	}

	/**
	 * @param {TInput<T>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		value = this.toRaw(value);
		for (const key in this.types) {
			if (!Object.prototype.hasOwnProperty.call(this.types, key)) continue;
			const type = this.types[key];
			type.appendToByteBuffer(value[key], bytebuffer);
		}
	}

	/**
	 * @param {TInput<T>} value
	 * @returns {TOutput<T>}
	 */
	toRaw(value) {
		if (typeof value !== 'object' || value === null) throw new Error('value is not a object');
		for (const key in value) {
			if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
			const type = this.types[key];
			if (!type) throw new Error(`unknown property ${key}`);
			try {
				type.validate(value[key]);
			} catch (error) {
				throw new Error(`key "${key}": ${error.message}`);
			}
		}
		return value;
	}

}

/**
 * @template {Types} T
 * @param {T} types
 * @returns {Dict<T>}
 */
export default function dict(types) { return new Dict(types); }
export { Dict };
