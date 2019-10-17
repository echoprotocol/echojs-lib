import OperationId from "./OperationId";
import { SerializerOutput } from "../serializers/ISerializer";
import { TOperationOutput } from "../serializers/operation";

export default interface TransactionObject {
	ref_block_num: number,
	ref_block_prefix: number,
	fees_collected: number,
	expiration: string,
	operations: TOperationOutput<OperationId>[],
	extensions: any[],
	signatures: string[],
	operation_results: any[][];
}
