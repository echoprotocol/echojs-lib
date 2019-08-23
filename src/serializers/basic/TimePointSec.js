import { UInt32Serializer } from './integers';

/** @typedef {import("../ISerializer").default} ISerializer */

/**
 * @template {ISerializer} T
 * @typedef {import("../ISerializer").SerializerInput<T>} SerializerInput
 */

/**
 * @template {ISerializer} T
 * @typedef {import("../ISerializer").SerializerOutput<T>} SerializerOutput
 */

/**
 * @param {Date} date
 * @returns {number}
 */
function getSeconds(date) { return Math.floor(date.getTime() / 1000); }

export default class TimePointSecSerializer extends UInt32Serializer {

	/**
	 * @param {SerializerInput<UInt32Serializer> | Date} value
	 * @returns {SerializerOutput<UInt32Serializer>}
	 */
	toRaw(value) {
		if (value instanceof Date) return super.toRaw(getSeconds(value));
		return super.toRaw(value);
	}

}
