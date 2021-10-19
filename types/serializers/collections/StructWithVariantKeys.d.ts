import * as ByteBuffer from "bytebuffer";
import ISerializer, { SerializerInput, SerializerOutput } from "../ISerializer";

export type SerializersMap = { [key: string]: ISerializer };

type ExtraSerializer = {
  keyIndexInStructure: number,
  serializersData: [string, ISerializer][],
}

export type ExtraSerializersData = ExtraSerializer[];

type ExtraSerializerKey = ExtraSerializer['serializersData'][number][0];

type TInput<T extends SerializersMap, V extends ExtraSerializersData> = {
  [key in keyof T]: SerializerInput<T[key]> & { [key in ExtraSerializerKey]: SerializerInput<V[number]['serializersData'][number][1]> }
};

type TOutput<T extends SerializersMap, V extends ExtraSerializersData> = {
  [key in keyof T]: SerializerOutput<T[key]> & { [key in ExtraSerializerKey]: SerializerInput<V[number]['serializersData'][number][1]> }
};

export default class StructWithVariantKeysSerializer<T extends SerializersMap, V extends ExtraSerializersData> extends ISerializer<TInput<T, V>, TOutput<T, V>> {
  readonly serializers: Readonly<T>;
  readonly extraSerializers: Readonly<V>;

  constructor(serializers: Readonly<T>, extraSerializers: Readonly<V>);
  toRaw(value: TInput<T, V>): TOutput<T, V>;
  appendToByteBuffer(value: TInput<T, V>, bytebuffer: ByteBuffer): void;
  readFromBuffer(buffer: Buffer, offset?: number): { res: TOutput<T, V>, newOffset: number };
}
