import * as ByteBuffer from "bytebuffer";

export default abstract class ISerializer<TInput = any, TOutput = any> {
	abstract appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
	abstract toRaw(value: TInput): TOutput;
	validate(value: TInput): void;
	serialize(value: TInput): Buffer;
}

export type SerializerInput<T extends ISerializer> = Parameters<T['toRaw']>[0];
export type SerializerOutput<T extends ISerializer> = ReturnType<T['toRaw']>;
