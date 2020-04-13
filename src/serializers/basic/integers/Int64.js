import IIntSerializer from './IIntSerializer';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @typedef {import("../../ISerializer").default} ISerializer */

/**
 * @template {ISerializer} T
 * @typedef {import("../../ISerializer").SerializerInput<T>} SerializerInput
 */

/** @augments {IIntSerializer<number | string>} */
export default class Int64Serializer extends IIntSerializer {

	constructor() {
		super(64);
	}

	/**
	 * @param {SerializerInput<Int64Serializer>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		bytebuffer.writeInt64(raw);
	}

}
