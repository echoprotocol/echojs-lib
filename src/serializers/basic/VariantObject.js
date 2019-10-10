import ISerializer from '../ISerializer';
import { isString } from '../../utils/validators';

/** @typedef {[string, any]} TInput */
/** @typedef {[string, any]} TOutput */

/** @augments {ISerializer<TInput, TOutput>} */
export default class VariantObjectSerializer extends ISerializer {

	/**
	 * @param {TInput} value
	 * @returns {TOutput}
	 */
	toRaw(value) {
		if (!Array.isArray(value)) throw new Error('value is not an array');
		if (value.length !== 2) throw new Error('VariantObject should have 2 elements');
		if (!isString(value[0])) throw new Error('First element should be string');
		return value;
	}

	appendToByteBuffer() {
		super.appendToByteBuffer();
	}

	readFromBuffer() {
		super.readFromBuffer();
	}

}
