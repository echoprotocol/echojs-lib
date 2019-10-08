import * as ByteBuffer from "bytebuffer";
import ISerializer from "../ISerializer";

type TInput = Buffer | string;

export default class BytesSerializer extends ISerializer<TInput, string> {
	readonly bytesCount?: number;
	constructor(bytesCount?: number);
	toRaw(value: TInput): string;
	appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
	readFromBuffer(buffer: Buffer, offset?: number): { res: string, newOffset: number };
}
