import * as ByteBuffer from "bytebuffer";
import IIntSerializer from "./IIntSerializer";
import { SerializerInput } from "../../ISerializer";

export default class VarInt32Serializer extends IIntSerializer<number> {
	appendToByteBuffer(value: SerializerInput<VarInt32Serializer>, bytebuffer: ByteBuffer): void;
	readFromBuffer(buffer: Buffer, offset?: number): { res: number, newOffset: number };
}
