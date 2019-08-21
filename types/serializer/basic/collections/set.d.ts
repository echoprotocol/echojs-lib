import * as ByteBuffer from "bytebuffer";
import Serializable from "../../serializable";

type InputType<T extends Serializable> = Parameters<T['toRaw']>[0];
type OutputType<T extends Serializable> = ReturnType<T['toRaw']>;

type TInput<T extends Serializable> = undefined | InputType<T>[] | Set<InputType<T>>;
type TOutput<T extends Serializable> = OutputType<T>[];

export class SetType<T extends Serializable> extends Serializable<TInput<T>, TOutput<T>> {
	readonly type: T;
	constructor(type: T);
	toRaw(value: TInput<T>): TOutput<T>;
	appendToByteBuffer(value: TInput<T>, bytebuffer: ByteBuffer): void;
}

export default function set<T extends Serializable>(type: T): SetType<T>;
