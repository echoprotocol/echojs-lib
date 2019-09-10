import * as ByteBuffer from "bytebuffer";
import ISerializer, { SerializerInput, SerializerOutput } from "../ISerializer";

export type SerializersMap = { [key: string]: ISerializer };

type TInput<T extends SerializersMap> = { [key in keyof T]: SerializerInput<T[key]> };

type TOutput<T extends SerializersMap> = { [key in keyof T]: SerializerOutput<T[key]> };

export default class StructSerializer<T extends SerializersMap> extends ISerializer<TInput<T>, TOutput<T>> {
	readonly serializers: Readonly<T>;
	constructor(serializers: Readonly<T>);
	toRaw(value: TInput<T>): TOutput<T>;
	appendToByteBuffer(value: TInput<T>, bytebuffer: ByteBuffer): void;
	readFromBuffer(buffer: Buffer, offset?: number): { res: TOutput<T>, newOffset: number };
}
