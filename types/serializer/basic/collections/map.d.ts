import * as ByteBuffer from "bytebuffer";
import Serializable from "../../serializable";

type InputType<T extends Serializable> = Parameters<T['toRaw']>[0];
type OutputType<T extends Serializable> = ReturnType<T['toRaw']>;

type TPreInput<TKey extends Serializable, TValue extends Serializable> =
	[InputType<TKey>, InputType<TValue>][] |
	Map<InputType<TKey>, InputType<TValue>>

type TInput<TKey extends Serializable, TValue extends Serializable> = string extends InputType<TKey> ? (
	TPreInput<TKey, TValue> | { [key: string]: InputType<TValue> }
) : TPreInput<TKey, TValue>

type TOutput<TKey extends Serializable, TValue extends Serializable> = [OutputType<TKey>, OutputType<TValue>][];

export class MapType<
	TKey extends Serializable,
	TValue extends Serializable
> extends Serializable<TInput<TKey, TValue>> {
	readonly keyType: TKey;
	readonly valueType: TValue;
	constructor(keyType: TKey, valueType: TValue);
	toRaw(value: TInput<TKey, TValue>): TOutput<TKey, TValue>;
	appendToByteBuffer(value: TInput<TKey, TValue>, bytebuffer: ByteBuffer): void;
}

export default function map<TKey extends Serializable, TValue extends Serializable>(
	keyType: TKey,
	valueType: TValue,
): MapType<TKey, TValue>
