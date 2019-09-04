import IUIntSerializer from './IUIntSerializer';

/** @typedef {import("bytebuffer")} ByteBuffer */
/** @typedef {import("../../ISerializer").default} ISerializer */

/**
 * @template {ISerializer} T
 * @typedef {import("../../ISerializer").SerializerInput<T>} SerializerInput
 */

/** @augments {IUIntSerializer<number>} */
export default class UInt32Serializer extends IUIntSerializer {

	constructor() { super(32); }

	/**
	 * @param {SerializerInput<UInt32Serializer>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		bytebuffer.writeUint32(raw);
	}

}
