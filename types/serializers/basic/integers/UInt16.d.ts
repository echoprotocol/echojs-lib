import * as ByteBuffer from "bytebuffer";
import IUIntSerializer from "./IUIntSerializer";
import { SerializerInput } from "../../ISerializer";

export default class UInt16Serializer extends IUIntSerializer<number> {
	appendToByteBuffer(value: SerializerInput<UInt16Serializer>, bytebuffer: ByteBuffer): void;
}
