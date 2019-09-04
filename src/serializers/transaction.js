import { struct, vector } from './collections';
import { uint16, uint32 } from './basic/integers';
import { timePointSec, bytes } from './basic';
import { extensions } from './chain';
import OperationSerializer from './operation';

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
});
