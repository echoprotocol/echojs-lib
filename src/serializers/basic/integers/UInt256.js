import ByteBuffer from 'bytebuffer';
import IUIntSerializer from './IUIntSerializer';

/** @typedef {import("bytebuffer")} ByteBuffer */
/** @typedef {import("../../ISerializer").default} ISerializer */

/**
 * @template {ISerializer} T
 * @typedef {import("../../ISerializer").SerializerInput<T>} SerializerInput
 */

/** @augments {IUIntSerializer<string>} */
export default class UInt256Serializer extends IUIntSerializer {

	constructor() { super(256); }

	/**
	 * @param {SerializerInput<UInt64Serializer>} value
	 */
	appendToByteBuffer(value) {
		const raw = this.toRaw(value);
		super.writeUint64(ByteBuffer.Long.fromString(raw));
	}

}
