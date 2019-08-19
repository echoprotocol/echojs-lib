import OperationId from "./OperationId";
import { serialization_output } from "./serializer/serialization";
import { AnyOperation } from "./serializer/operation";

export default interface TransactionObject {
	ref_block_num: number,
	ref_block_prefix: number,
	expiration: string,
	operations: AnyOperation<serialization_output>[],
	extensions: any[],
	signatures: string[],
	operation_results: any[][];
}
