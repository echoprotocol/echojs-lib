import Long from 'long';
import IUIntSerializer from './IUIntSerializer';

/** @typedef {import("bytebuffer")} ByteBuffer */
/** @typedef {import("../../ISerializer").default} ISerializer */

/**
 * @template {ISerializer} T
 * @typedef {import("../../ISerializer").SerializerInput<T>} SerializerInput
 */

/** @augments {IUIntSerializer<string>} */
export default class UInt64Serializer extends IUIntSerializer {

	constructor() { super(64); }

	/**
	 * @param {SerializerInput<UInt64Serializer>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		bytebuffer.writeUint64(Long.fromString(raw));
	}

}
