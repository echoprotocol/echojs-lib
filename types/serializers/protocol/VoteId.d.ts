import * as ByteBuffer from "bytebuffer";
import ISerializer from "../ISerializer";

type TInput = string | { type: number, id: number };
type TOutput = string;

export default class VoteIdSerializer extends ISerializer<TInput, TOutput> {
	toRaw(value: TInput): TOutput;
	appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
	readFromBuffer(buffer: Buffer, offset?: number): { res: TOutput, newOffset: number };
}
