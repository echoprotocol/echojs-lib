import * as ByteBuffer from "bytebuffer";
import ISerializer, { SerializerInput } from "../../ISerializer";
import { RESERVED_SPACES, IMPLEMENTATION_OBJECT_TYPE } from "../../../constants/chain-types";
import { OBJECT_TYPES } from "../../../constants";
import { VarInt32Serializer } from "../../basic/integers";

type ObjectTypeId<T extends RESERVED_SPACES> = {
	[RESERVED_SPACES.RELATIVE_PROTOCOL_IDS]: never;
	[RESERVED_SPACES.PROTOCOL_IDS]: OBJECT_TYPES;
	[RESERVED_SPACES.IMPLEMENTATION_IDS]: IMPLEMENTATION_OBJECT_TYPE;
}[T];

type TInput = string | SerializerInput<VarInt32Serializer>;

export default class ObjectIdSerializer<T extends RESERVED_SPACES> extends ISerializer<string, string> {
	readonly reservedSpaceId: T;
	readonly objectTypeIds: ObjectTypeId<T>[];
	constructor(reservedSpaceId: T, objectTypeId: ObjectTypeId<T> | ObjectTypeId<T>[]);
	toRaw(value: TInput): string;
	appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
}
