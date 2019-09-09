import * as ByteBuffer from "bytebuffer";
import IUIntSerializer from "./IUIntSerializer";
import { SerializerInput } from "../../ISerializer";

export default class UInt8Serializer extends IUIntSerializer<number> {
	appendToByteBuffer(value: SerializerInput<UInt8Serializer>, bytebuffer: ByteBuffer): void;
}
