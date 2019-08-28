import * as ByteBuffer from "bytebuffer";

export default abstract class ISerializer<TInput = any, TOutput = any> {
	__TInput__: TInput;
	__TOutput__: TOutput;
	abstract appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
	abstract toRaw(value: TInput): TOutput;
	validate(value: TInput): void;
	serialize(value: TInput): Buffer;
}

export type SerializerInput<T extends ISerializer> = ISerializer['__TInput__'];
export type SerializerOutput<T extends ISerializer> = ISerializer['__TOutput__'];
