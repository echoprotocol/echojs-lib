import * as ByteBuffer from "bytebuffer";
import IIntSerializer from "./IIntSerializer";
import { SerializerInput, SerializerOutput } from "../../ISerializer";

export default class Int32Serializer extends IIntSerializer<number | string> {
	appendToByteBuffer(value: SerializerInput<Int32Serializer>, bytebuffer: ByteBuffer): void;
}
