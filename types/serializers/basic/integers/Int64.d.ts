import * as ByteBuffer from "bytebuffer";
import IIntSerializer from "./IIntSerializer";
import { SerializerInput } from "../../ISerializer";

export default class Int64Serializer extends IIntSerializer<string | number> {
	appendToByteBuffer(value: SerializerInput<Int64Serializer>, bytebuffer: ByteBuffer): void;
}
