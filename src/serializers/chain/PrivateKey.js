import ISerializer from '../ISerializer';
import PrivateKey from '../../crypto/private-key';

/** @typedef {PrivateKey | string} TInput */
/** @typedef {string} TOutput */

/** @augments {ISerializer<TInput, TOutput>} */
export default class PrivateKeySerializer extends ISerializer {

	/**
	 * @param {TInput} value
	 *
	 * @returns {TOutput}
	 */
	toRaw(value) {
		if (typeof value === 'string') {
			value = PrivateKey.fromWif(value);
		}
		return value.toWif();
	}

	/**
	 *
	 */
	appendToByteBuffer() {
		super.appendToByteBuffer();
	}

}
