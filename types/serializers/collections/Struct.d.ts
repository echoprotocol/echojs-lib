import * as ByteBuffer from "bytebuffer";
import ISerializer, { SerializerInput, SerializerOutput } from "../ISerializer";

export type SerializersMap = { [key: string]: ISerializer };
type TInput<T extends SerializersMap, TKey extends keyof T = keyof T> = SerializerInput<T[TKey]>;
type TOutput<T extends SerializersMap, TKey extends keyof T = keyof T> = SerializerOutput<T[TKey]>;

export default class StructSerializer<T extends SerializersMap> extends ISerializer<TInput<T>, TOutput<T>> {
	readonly serializers: Readonly<T>;
	constructor(serializers: Readonly<T>);
	toRaw<TKey extends keyof T>(value: TInput<T, TKey>): TOutput<T, TKey>;
	appendToByteBuffer<TKey extends keyof T>(value: TInput<T, TKey>, bytebuffer: ByteBuffer): void;
}
