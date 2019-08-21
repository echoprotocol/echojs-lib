import * as ByteBuffer from "bytebuffer";

export default abstract class Serializable<TInput = any, TOutput = any> {
	abstract appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
	abstract toRaw(value: TInput): TOutput;
	validate(value: TInput): void;
	serialize(value: TInput): Buffer;
}
