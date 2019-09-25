import * as ByteBuffer from "bytebuffer";
import ISerializer, { SerializerInput, SerializerOutput } from "../ISerializer";

type TStrictInput<TKey extends ISerializer, TValue extends ISerializer> =
	Map<SerializerInput<TKey>, SerializerOutput<TValue>> | [SerializerInput<TKey>, SerializerOutput<TValue>][];

type TInput<TKey extends ISerializer, TValue extends ISerializer> = string extends SerializerInput<TKey> ?
	TStrictInput<TKey, TValue> | { [key: string]: SerializerInput<TValue> } :
	TStrictInput<TKey, TValue>;

type TOutput<TKey extends ISerializer, TValue extends ISerializer> =
	[SerializerOutput<TKey>, SerializerOutput<TValue>][];

export default class MapSerializer<TKey extends ISerializer, TValue extends ISerializer> extends ISerializer<
	TInput<TKey, TValue>,
	TOutput<TKey, TValue>
> {
	readonly keySerializer: TKey;
	readonly valueSerializer: TValue;
	constructor(keySerializer: TKey, valueSerializer: TValue);
	toRaw(value: TInput<TKey, TValue>): TOutput<TKey, TValue>;
	appendToByteBuffer(value: TInput<TKey, TValue>, bytebuffer: ByteBuffer): void;
	readFromBuffer(buffer: Buffer, offset?: number): { res: TOutput<TKey, TValue>, newOffset: number };
}
