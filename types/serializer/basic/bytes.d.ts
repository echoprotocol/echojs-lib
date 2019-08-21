import * as ByteBuffer from "bytebuffer";
import Serializable from "../serializable";

type TInput = string | Buffer;

export class BytesType extends Serializable<TInput, string> {
	readonly size?: number;
	constructor(size?: number);
	toRaw(value: TInput): string;
	appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
}

export default function bytes(size?: number): BytesType;
