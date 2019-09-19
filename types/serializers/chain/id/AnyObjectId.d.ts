import * as ByteBuffer from 'bytebuffer';
import ISerializer from '../../ISerializer';

type TInput = string;
type TOutput = string;

export default class AnyObjectIdSerializer extends ISerializer<TInput, TOutput> {
	toRaw(value: TInput): TOutput;
	appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
	readFromBuffer(buffer: Buffer, offset?: number): { res: TOutput, newOffset: number };
}
