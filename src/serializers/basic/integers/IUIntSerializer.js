import BigNumber from 'bignumber.js';
import IIntSerializer from './IIntSerializer';

/** @typedef {import("../../ISerializer").default} ISerializer */

/**
 * @template {ISerializer} T
 * @typedef {import("../../ISerializer").SerializerInput<T>} SerializerInput
 */

/**
 * @template {ISerializer} T
 * @typedef {import("../../ISerializer").SerializerOutput<T>} SerializerOutput
 */

/**
 * @abstract
 * @template {number | string} T
 * @augments {IIntSerializer<T>}
 */
export default class IUIntSerializer extends IIntSerializer {

	/** @param {number} bitsCount */
	constructor(bitsCount) { super(bitsCount, true); }

	/**
	 * @param {SerializerInput<IIntSerializer<T>>} value
	 * @returns {SerializerOutput<IIntSerializer<T>>}
	 */
	toRaw(value) {
		const rawInt = super.toRaw(value);
		if (new BigNumber(rawInt).isNegative()) throw new Error('unsigned integer unable to be negative');
		return rawInt;
	}

}
