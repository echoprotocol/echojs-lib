import * as ByteBuffer from "bytebuffer";
import IIntSerializer from "./IIntSerializer";
import { SerializerInput, SerializerOutput } from "../../ISerializer";

type IInput = SerializerInput<IIntSerializer<string>>;

export default class Int64Serializer extends IIntSerializer<string> {
	toRaw(value: IInput): SerializerOutput<IIntSerializer<string>>;
	appendToByteBuffer(value: IInput, bytebuffer: ByteBuffer): void;
}
