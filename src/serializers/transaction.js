import { struct, vector } from './collections';
import { uint16, uint32, int64 } from './basic/integers';
import { timePointSec, bytes, bool } from './basic';
import { extensions } from './chain';
import OperationSerializer from './operation';
import OperationResultSerializer from './operation_result';

const transactionSerializer = struct({
	ref_block_num: uint16,
	ref_block_prefix: uint32,
	expiration: timePointSec,
	operations: vector(new OperationSerializer()),
	extensions,
});
export default transactionSerializer;

export const signedTransactionSerializer = struct({
	...transactionSerializer.serializers,
	signatures: vector(bytes(64)),
	signed_with_echorand_key: bool,
});

export const processedTransactionSerializer = struct({
	...signedTransactionSerializer.serializers,
	operation_results: vector(OperationResultSerializer),
	fees_collected: int64,
});
