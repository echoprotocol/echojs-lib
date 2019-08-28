import OperationId from "./OperationId";
import { SerializerOutput } from "../serializers/ISerializer";
import { OperationSerializer } from "../serializers/operations";

export default interface TransactionObject {
	ref_block_num: number,
	ref_block_prefix: number,
	expiration: string,
	operations: SerializerOutput<OperationSerializer>[],
	extensions: any[],
	signatures: string[],
	operation_results: any[][];
}
