import { struct, vector } from './collections';
import { uint16, uint32 } from './basic/integers';
import { timePointSec, bytes } from './basic';
import { operation } from './operations';
import { extensions } from './chain';

const transactionSerializer = struct({
	ref_block_num: uint16,
	ref_block_prefix: uint32,
	expiration: timePointSec,
	operations: operation,
	extensions,
});
export default transactionSerializer;

export const signedTransactionSerializer = struct({
	...transactionSerializer.serializers,
	signatures: vector(bytes(64)),
});
