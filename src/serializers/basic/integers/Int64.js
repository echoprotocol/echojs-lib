import IIntSerializer from "./IIntSerializer";

/** @typedef {import("../../ISerializer").default} ISerializer */

/**
 * @template {ISerializer} T
 * @typedef {import("../../ISerializer").SerializerInput<T>} SerializerInput
 */

/** @typedef {SerializerInput<IIntSerializer<string>>} TInput */

/** @augments {IIntSerializer<TInput>} */
export default class Int64Serializer extends IIntSerializer {

	constructor() {
		super(64);
	}

}
