import * as ByteBuffer from "bytebuffer";
import Serializable from "../../serializable";
import { RESERVED_SPACES, IMPLEMENTATION_OBJECT_TYPE } from "../../../constants/chain-types";
import PROTOCOL_OBJECT_TYPE_ID from "../../../interfaces/ProtocolObjectTypeId";

type TypeId<T extends RESERVED_SPACES> = {
	[RESERVED_SPACES.RELATIVE_PROTOCOL_IDS]: unknown;
	[RESERVED_SPACES.PROTOCOL_IDS]: PROTOCOL_OBJECT_TYPE_ID;
	[RESERVED_SPACES.IMPLEMENTATION_IDS]: IMPLEMENTATION_OBJECT_TYPE;
}[T];

type TInput = string | number;

export class IdType<T extends RESERVED_SPACES> extends Serializable<TInput, string> {
	readonly reservedSpaceId: T;
	readonly typeId: TypeId<T>;
	constructor(reservedSpaceId: T, objectTypeId: TypeId<T> | TypeId<T>[]);
	toRaw(value: TInput): string;
	appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
}

export default function id<T extends RESERVED_SPACES>(
	reservedSpaceId: T,
	objectTypeId: TypeId<T> | TypeId<T>[],
): IdType<T>;
