import * as ByteBuffer from "bytebuffer";
import ISerializer from "../ISerializer";
import PublicKey from "../../crypto/public-key";

type TInput = PublicKey | string;
type TOutput = string;

export default class PublicKeySerializer extends ISerializer<TInput, TOutput> {
	toRaw(value: TInput, addressPrefix?: string): TOutput;
	appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer, addressPrefix?: string): void;
	readFromBuffer(buffer: Buffer, offset?: number): { res: TOutput, newOffset: number };
}
