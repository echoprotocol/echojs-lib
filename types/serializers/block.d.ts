import { StructSerializer, VectorSerializer } from "./collections";
import { uint64, uint8, uint32 } from './basic/integers';
import { timePointSec, StringSerializer, BytesSerializer } from './basic';
import { extensions, sha256, ripemd160 } from './chain';
import { processedTransactionSerializer } from './transaction';
import { accountId } from './chain/id/protocol';

export const blockSignatureSerializer: StructSerializer<{
	_bba_sign: BytesSerializer,
	_delegate: typeof uint32,
	_fallback: typeof uint32,
	_leader: typeof uint64,
	_producer: typeof uint32,
	_step: typeof uint32,
	_value: typeof uint8,
}>;

export const blockHeaderSerializer: StructSerializer<{
	previous: typeof ripemd160,
	round: typeof uint64,
	attempt: typeof uint8,
	timestamp: typeof timePointSec,
	account: typeof accountId,
	delegate: typeof accountId,
	transaction_merkle_root: typeof ripemd160,
	vm_root: VectorSerializer<StringSerializer>,
	prev_signatures: VectorSerializer<typeof blockSignatureSerializer>,
	extensions: typeof extensions,
}>;

export const signedBlockHeaderSerializer: StructSerializer<typeof blockHeaderSerializer['serializers'] & {
	ed_signature: BytesSerializer,
	rand: typeof sha256,
	cert: VectorSerializer<typeof blockSignatureSerializer>,
}>;

export const signedBlockSerializer: StructSerializer<typeof signedBlockHeaderSerializer['serializers'] & {
	transactions: VectorSerializer<typeof processedTransactionSerializer>,
}>;
