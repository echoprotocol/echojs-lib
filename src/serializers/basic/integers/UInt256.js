import IUIntSerializer from './IUIntSerializer';

/** @typedef {import("../../ISerializer").default} ISerializer */

/**
 * @template {ISerializer} T
 * @typedef {import("../../ISerializer").SerializerInput<T>} SerializerInput
 */

/** @augments {IUIntSerializer<string>} */
export default class UInt256Serializer extends IUIntSerializer {

	constructor() { super(256); }

	appendToByteBuffer() {
		super.appendToByteBuffer();
	}

}
