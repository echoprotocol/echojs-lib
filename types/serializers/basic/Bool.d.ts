import * as ByteBuffer from "bytebuffer";
import ISerializer from "../ISerializer";

type TInput = boolean;
type TOutput = boolean;

export default class BoolSerializer extends ISerializer<TInput, TOutput> {
	toRaw(value: TInput): TOutput;
	appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
	readFromBuffer(buffer: Buffer, offset?: number): { res: TOutput, newOffset: number };
}
