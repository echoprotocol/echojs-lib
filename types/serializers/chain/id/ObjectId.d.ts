import * as ByteBuffer from "bytebuffer";
import ISerializer, { SerializerInput } from "../../ISerializer";
import { RESERVED_SPACE_ID, IMPLEMENTATION_OBJECT_TYPE_ID } from "../../../constants/chain-types";
import { PROTOCOL_OBJECT_TYPE_ID } from "../../../constants";
import { VarInt32Serializer } from "../../basic/integers";

export type ObjectTypeId<T extends RESERVED_SPACE_ID> = {
	[RESERVED_SPACE_ID.RELATIVE_PROTOCOL]: never;
	[RESERVED_SPACE_ID.PROTOCOL]: PROTOCOL_OBJECT_TYPE_ID;
	[RESERVED_SPACE_ID.IMPLEMENTATION]: IMPLEMENTATION_OBJECT_TYPE_ID;
}[T];

type TInput = string | SerializerInput<VarInt32Serializer>;

export default class ObjectIdSerializer<T extends RESERVED_SPACE_ID> extends ISerializer<string, string> {
	readonly reservedSpaceId: T;
	readonly objectTypeIds: ObjectTypeId<T>[];
	constructor(reservedSpaceId: T, objectTypeId: ObjectTypeId<T> | ObjectTypeId<T>[]);
	toRaw(value: TInput): string;
	appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
	readFromBuffer(buffer: Buffer, offset?: number): { res: string, newOffset: number };
}
