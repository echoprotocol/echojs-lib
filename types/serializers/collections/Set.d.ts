import * as ByteBuffer from "bytebuffer";
import ISerializer, { SerializerInput, SerializerOutput } from "../ISerializer";
import VectorSerializer from "./Vector";

type TInput<T extends ISerializer> =
	SerializerInput<VectorSerializer<T>>[] | Set<SerializerInput<VectorSerializer<T>>> | undefined;

export default class SetSerializer<T extends ISerializer> extends VectorSerializer<T> {
	constructor(serializer: T);
	validate(value: TInput<T>): void;
	serialize(value: TInput<T>): Buffer;
	toRaw(value: TInput<T>): SerializerOutput<VectorSerializer<T>>;
	appendToByteBuffer(value: TInput<T>, bytebuffer: ByteBuffer): void;
}
