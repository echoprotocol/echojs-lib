import * as ByteBuffer from "bytebuffer";
import IUIntSerializer from "./IUIntSerializer";
import { SerializerInput } from "../../ISerializer";

export default class UInt64Serializer extends IUIntSerializer<string> {
	appendToByteBuffer(value: SerializerInput<UInt64Serializer>, bytebuffer: ByteBuffer): void;
}
