import * as ByteBuffer from "bytebuffer";
import Serializable from "../../serializable";

type TInput<T extends Serializable> = Parameters<T['toRaw']>[0][];
type TOutput<T extends Serializable> = ReturnType<T['toRaw']>[];

export class ArrayType<T extends Serializable> extends Serializable<TInput<T>, TOutput<T>> {
	constructor(type: T);
	readonly type: T;
	appendToByteBuffer(value: TInput<T>, bytebuffer: ByteBuffer, writeLength?: boolean): void;
	toRaw(value: TInput<T>): TOutput<T>;
}

export function array<T extends Serializable>(type: T): ArrayType<T>;
