import { timePointSec, BytesSerializer } from "./basic";
import { uint16, uint32, int64 } from "./basic/integers";
import { extensions } from "./chain";
import { StructSerializer, VectorSerializer } from "./collections";
import OperationSerializer from "./operation";
import OperationResultSerializer from "./operation_result";

declare const transactionSerializer: StructSerializer<{
	ref_block_num: typeof uint16,
	ref_block_prefix: typeof uint32,
	expiration: typeof timePointSec,
	operations: OperationSerializer,
	extensions: typeof extensions,
}>;
export default transactionSerializer;

export const signedTransactionSerializer: StructSerializer<typeof transactionSerializer['serializers'] & {
	signatures: VectorSerializer<BytesSerializer>,
}>;


export const processedTransactionSerializer: StructSerializer<typeof signedTransactionSerializer['serializers'] & {
	operation_results: VectorSerializer<typeof OperationResultSerializer>,
	fees_collected: typeof int64,
}>;
