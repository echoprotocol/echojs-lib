import * as ByteBuffer from "bytebuffer";
import Serializable from "../serializable";

type TInput<T extends Serializable> = Parameters<T['toRaw']>[0] | undefined;
type TOutput<T extends Serializable> = ReturnType<T['toRaw']> | undefined;

export class OptionalType<T extends Serializable> extends Serializable<TInput<T>, TOutput<T>> {
	readonly type: T;
	constructor(type: T);
	toRaw(value: TInput<T>): typeof value extends undefined ? undefined : ReturnType<T['toRaw']>;
	appendToByteBuffer(value: TInput<T>, bytebuffer: ByteBuffer): void;
}

export default function optional<T extends Serializable>(type: T): OptionalType<T>;
