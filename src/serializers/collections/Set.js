import VectorSerializer from './Vector';

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
 * @typedef {SerializerInput<T>[] | Set<SerializerInput<T>>} TInput
 */

/**
 * @template {ISerializer} T
 * @augments {VectorSerializer<T>}
 */
export default class SetSerializer extends VectorSerializer {

	/**
	 * @param {TInput<T>} value
	 * @returns {TOutput<T>}
	 */
	toRaw(value) {
		if (value instanceof Set) value = [...value];
		/** @type {ReturnType<VectorSerializer<T>['toRaw']>} */
		let raw;
		try {
			raw = super.toRaw(value);
		} catch (error) {
			throw new Error(`set: ${error.message}`);
		}
		/** @type {string[]} */
		const serializedElements = new Array(raw.length);
		for (let i = 0; i < raw.length; i += 1) {
			serializedElements[i] = this.serializer.serialize(raw[i]).toString('hex');
			for (let j = 0; j < i; j += 1) {
				if (serializedElements[i] === serializedElements[j]) {
					throw new Error(`set element with index ${i} is equals to the other one with index ${j}`);
				}
			}
		}
		return raw;
	}

}
