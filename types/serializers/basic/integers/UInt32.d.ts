import * as ByteBuffer from "bytebuffer";
import IUIntSerializer from "./IUIntSerializer";
import { SerializerInput } from "../../ISerializer";

export default class UInt32Serializer extends IUIntSerializer<number> {
	appendToByteBuffer(value: SerializerInput<UInt32Serializer>, bytebuffer: ByteBuffer): void;
}
