import { timePointSec, BytesSerializer } from "./basic";
import { uint16, uint32 } from "./basic/integers";
import { extensions } from "./chain";
import { StructSerializer, VectorSerializer } from "./collections";
import { operation } from "./operations";

declare const transactionSerializer: StructSerializer<{
	ref_block_num: typeof uint16,
	ref_block_prefix: typeof uint32,
	expiration: typeof timePointSec,
	operations: typeof operation,
	extensions: typeof extensions,
}>;
export default transactionSerializer;

export const signedTransactionSerializer: StructSerializer<typeof transactionSerializer['serializers'] & {
	signatures: VectorSerializer<BytesSerializer>,
}>;
