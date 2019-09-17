import * as ByteBuffer from "bytebuffer";
import ISerializer, { SerializerInput, SerializerOutput } from "../ISerializer";

type TInput<T extends ISerializer> = undefined | SerializerInput<T>;
type TOutput<T extends ISerializer> = undefined | SerializerOutput<T>;

export default class OptionalSerializer<T extends ISerializer> extends ISerializer<TInput<T>, TOutput<T>> {
	readonly serializer: T;
	constructor(serializer: T);

	toRaw<TProvided extends boolean>(
		value: TProvided extends true ? SerializerInput<T> : undefined,
	): TProvided extends true ? SerializerOutput<T> : undefined;

	appendToByteBuffer(value: TInput<T>, bytebuffer: ByteBuffer): void;
	readFromBuffer(buffer: Buffer, offset?: number): { res: TOutput<T>, newOffset: number };
}
