import ByteBuffer from 'bytebuffer';
import IUIntSerializer from './IUIntSerializer';

/** @typedef {import("bytebuffer")} ByteBuffer */
/** @typedef {import("../../ISerializer").default} ISerializer */

/**
 * @template {ISerializer} T
 * @typedef {import("../../ISerializer").SerializerInput<T>} SerializerInput
 */

/** @augments {IUIntSerializer<number | string>} */
export default class UInt64Serializer extends IUIntSerializer {

	constructor() { super(64); }

	/**
	 * @param {SerializerInput<UInt64Serializer>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		bytebuffer.writeUint64(ByteBuffer.Long.fromString(raw));
	}

}
