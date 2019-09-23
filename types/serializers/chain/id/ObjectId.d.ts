import * as ByteBuffer from "bytebuffer";
import ISerializer, { SerializerInput } from "../../ISerializer";
import { RESERVED_SPACES, IMPLEMENTATION_OBJECT_TYPE } from "../../../constants/chain-types";
import { PROTOCOL_OBJECT_TYPE_ID } from "../../../constants";
import { VarInt32Serializer } from "../../basic/integers";

export type ObjectTypeId<T extends RESERVED_SPACES> = {
	[RESERVED_SPACES.RELATIVE_PROTOCOL_IDS]: never;
	[RESERVED_SPACES.PROTOCOL_IDS]: PROTOCOL_OBJECT_TYPE_ID;
	[RESERVED_SPACES.IMPLEMENTATION_IDS]: IMPLEMENTATION_OBJECT_TYPE;
}[T];

type TInput = string | SerializerInput<VarInt32Serializer>;

export default class ObjectIdSerializer<T extends RESERVED_SPACES> extends ISerializer<string, string> {
	readonly reservedSpaceId: T;
	readonly objectTypeIds: ObjectTypeId<T>[];
	constructor(reservedSpaceId: T, objectTypeId: ObjectTypeId<T> | ObjectTypeId<T>[]);
	toRaw(value: TInput): string;
	appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
	readFromBuffer(buffer: Buffer, offset?: number): { res: string, newOffset: number };
}
