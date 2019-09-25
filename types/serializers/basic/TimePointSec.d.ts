import * as ByteBuffer from "bytebuffer";
import { UInt32Serializer } from "./integers";
import ISerializer, { SerializerInput } from "../ISerializer";

type TInput = SerializerInput<UInt32Serializer> | Date;
type TOutput = string;

export default class TimePointSecSerializer extends ISerializer<TInput, TOutput> {
	toRaw(value: TInput): TOutput;
	appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
	readFromBuffer(buffer: Buffer, offset?: number): { res: TOutput, newOffset: number };
}
