import ISerializer from '../ISerializer';

/** @typedef {SerializerInput<array.<any>>} TInput */
/** @typedef {array.<any>} TOutput */

/** @augments {ISerializer<TInput, TOutput>} */
export default class VariantObjectSerializer extends ISerializer {

	/**
	 * @param {TInput<T>} value
	 * @returns {TOutput<T>}
	 */
	toRaw(value) {
		if (!Array.isArray(value)) throw new Error('value is not an array');
		if (value.length !== 2) throw new Error('VariantObject should have 2 elements');
		return value;
	}

	/**
	 *
	 */
	appendToByteBuffer() {
		super.appendToByteBuffer();
	}

}
