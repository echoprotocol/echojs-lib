import * as ByteBuffer from 'bytebuffer';
import ISerializer from '../ISerializer';
import OperationSerializer, { TOperationInput, TOperationOutput } from '../operation';
import OperationId from '../../interfaces/OperationId';

export class OperationWrapperSerializer extends ISerializer<
	TOperationInput<OperationId, boolean>,
	TOperationOutput<OperationId>
> {
	readonly operationSerializer: OperationSerializer;
	init(operationSerializer: OperationSerializer): void;
	toRaw<T extends OperationId>(value: TOperationInput<T, false>): TOperationOutput<T>;
	toRaw<T extends OperationId>(value: TOperationInput<T, true>, withUnrequiredFee: true): TOperationOutput<T>;
	appendToByteBuffer<T extends OperationId>(value: TOperationInput<T, false>, bytebuffer: ByteBuffer): void;
	readFromBuffer<T extends OperationId>(
		buffer: Buffer,
		offset?: number,
	): { res: TOperationOutput<T>, newOffset: number };
}

declare const opWrapper: OperationWrapperSerializer;
export default opWrapper;
