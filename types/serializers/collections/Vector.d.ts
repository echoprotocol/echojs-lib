import * as ByteBuffer from "bytebuffer";
import ISerializer, { SerializerInput, SerializerOutput } from "../ISerializer";

type TInput<T extends ISerializer> = SerializerInput<T>[];
type TOutput<T extends ISerializer> = SerializerOutput<T>[];

export default class VectorSerializer<
	T extends ISerializer,
	K extends any = TInput<T>
	> extends ISerializer<K, TOutput<T>> {
	readonly serializer: T;
	constructor(serializer: T);
	toRaw(value: K): TOutput<T>;
	appendToByteBuffer(value: K, bytebuffer: ByteBuffer): void;
	readFromBuffer(buffer: Buffer, offset?: number): { res: TOutput<T>, newOffset: number };
}
