import * as ByteBuffer from "bytebuffer";

export default abstract class ISerializer<TInput = any, TOutput = any> {
	__TInput__: TInput;
	__TOutput__: TOutput;
	abstract appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
	abstract toRaw(value: TInput): TOutput;
	abstract readFromBuffer(buffer: Buffer, offset?: number): { res: TOutput, newOffset: number };
	validate(value: TInput): void;
	serialize(value: TInput): Buffer;
	deserialize(buffer: Buffer): TOutput;
}

export type SerializerInput<T extends ISerializer> = T['__TInput__'];
export type SerializerOutput<T extends ISerializer> = T['__TOutput__'];
