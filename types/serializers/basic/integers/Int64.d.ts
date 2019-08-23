import * as ByteBuffer from "bytebuffer";
import IIntSerializer from "./IIntSerializer";
import { SerializerInput, SerializerOutput } from "../../ISerializer";

export default class Int64Serializer extends IIntSerializer<string> {
	appendToByteBuffer(value: SerializerInput<Int64Serializer>, bytebuffer: ByteBuffer): void;
}
