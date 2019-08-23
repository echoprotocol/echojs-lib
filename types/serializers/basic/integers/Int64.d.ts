import * as ByteBuffer from "bytebuffer";
import IIntSerializer from "./IIntSerializer";
import { SerializerInput, SerializerOutput } from "../../ISerializer";

type TInput = SerializerInput<IIntSerializer<string>>;

export default class Int64Serializer extends IIntSerializer<string> {
	toRaw(value: TInput): SerializerOutput<IIntSerializer<string>>;
	appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
}
