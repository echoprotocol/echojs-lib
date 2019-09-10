import { uint32 } from './integers';
import ISerializer from '../ISerializer';

/** @typedef {import("bytebuffer]")} ByteBuffer */
/** @typedef {import("./integers").UInt32Serializer} UInt32Serializer */

/**
 * @template {ISerializer} T
 * @typedef {import("../ISerializer").SerializerInput<T>} SerializerInput
 */

/** @typedef {SerializerInput<UInt32Serializer> | Date} TInput */
/** @typedef {string} TOutput */

/**
 * @param {Date} date
 * @returns {number}
 */
function getSeconds(date) { return Math.floor(date.getTime() / 1000); }

/** @augments {ISerializer<TInput, TOutput>} */
export default class TimePointSecSerializer extends ISerializer {

	/**
	 * @param {TInput} value
	 * @returns {TOutput}
	 */
	toRaw(value) {
		if (typeof value === 'string' && /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d$/.test(value)) {
			value = new Date(`${value}.000Z`);
		}
		if (!(value instanceof Date)) value = new Date(uint32.toRaw(value) * 1e3);
		return value.toISOString().split('.')[0];
	}

	/**
	 * @param {TInput} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		const totalSeconds = getSeconds(new Date(`${raw}.000Z`));
		uint32.appendToByteBuffer(totalSeconds, bytebuffer);
	}

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: TOutput, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		const { res: seconds, newOffset } = uint32.readFromBuffer(buffer, offset);
		return { res: this.toRaw(seconds), newOffset };
	}

}
