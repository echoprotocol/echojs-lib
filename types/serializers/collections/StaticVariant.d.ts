import * as ByteBuffer from "bytebuffer";
import ISerializer, { SerializerInput, SerializerOutput } from "../ISerializer";

export type Variants = { [key: number]: ISerializer };

type TInput<T extends Variants, TVariant extends number = number> = [
	TVariant,
	TVariant extends keyof T ? SerializerInput<T[TVariant]> : never,
];

type TOutput<T extends Variants, TVariant extends number = number> = [
	TVariant,
	TVariant extends keyof T ? SerializerOutput<T[TVariant]> : never,
];

export default class StaticVariantSerializer<T extends Variants> extends ISerializer<TInput<T>, TOutput<T>> {
	readonly serializers: Readonly<T>;
	constructor(serializers: Readonly<T>);
	toRaw<TVariant extends number>(value: TInput<T, TVariant>): TOutput<T, TVariant>;
	appendToByteBuffer<TVariant extends number>(value: TInput<T, TVariant>, bytebuffer: ByteBuffer): void;

	readFromBuffer<TVariant extends number>(
		buffer: Buffer,
		offset?: number,
	): { res: TOutput<T, TVariant>, newOffset: number };
}
