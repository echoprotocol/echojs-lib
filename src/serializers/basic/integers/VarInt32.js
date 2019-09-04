import IIntSerializer from './IIntSerializer';

/** @typedef {import("bytebuffer")} ByteBuffer */
/** @typedef {import("../../ISerializer").default} ISerializer */

/**
 * @template {ISerializer} T
 * @typedef {import("../../ISerializer").SerializerInput<T>} SerializerInput
 */

/** @augments {IIntSerializer<number>} */
export default class VarInt32Serializer extends IIntSerializer {

	constructor() { super(32); }

	/**
	 * @param {SerializerInput<VarInt32Serializer>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		bytebuffer.writeVarint32(raw);
	}

}
