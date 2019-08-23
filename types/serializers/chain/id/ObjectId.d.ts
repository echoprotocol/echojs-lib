import * as ByteBuffer from "bytebuffer";
import ISerializer from "../../ISerializer";
import { RESERVED_SPACES, IMPLEMENTATION_OBJECT_TYPE } from "../../../constants/chain-types";
import { OBJECT_TYPES } from "../../../constants";

type ObjectTypeId<T extends RESERVED_SPACES> = {
	[RESERVED_SPACES.RELATIVE_PROTOCOL_IDS]: never;
	[RESERVED_SPACES.PROTOCOL_IDS]: OBJECT_TYPES;
	[RESERVED_SPACES.IMPLEMENTATION_IDS]: IMPLEMENTATION_OBJECT_TYPE;
}[T];

export default class ObjectIdSerializer<T extends RESERVED_SPACES> extends ISerializer<string, string> {
	readonly reservedSpaceId: T;
	readonly objectTypeIds: ObjectTypeId<T>[];
	constructor(reservedSpaceId: T, objectTypeId: ObjectTypeId<T> | ObjectTypeId<T>[]);
	toRaw(value: string): string;
	appendToByteBuffer(value: string, bytebuffer: ByteBuffer): void;
}
