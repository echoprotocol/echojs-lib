import { struct, vector } from './collections';
import { uint64, uint8, uint32 } from './basic/integers';
import { timePointSec, string, bytes } from './basic';
import { extensions, sha256, ripemd160 } from './chain';
import { processedTransactionSerializer } from './transaction';
import { accountId } from './chain/id/protocol';

export const blockSignatureSerializer = struct({
	_bba_sign: bytes(64),
	_delegate: uint32,
	_fallback: uint32,
	_leader: uint64,
	_producer: uint32,
	_step: uint32,
	_value: uint8,
});

export const blockHeaderSerializer = struct({
	previous: ripemd160,
	round: uint64,
	attempt: uint8,
	timestamp: timePointSec,
	account: accountId,
	delegate: accountId,
	transaction_merkle_root: ripemd160,
	vm_root: vector(string),
	prev_signatures: vector(blockSignatureSerializer),
	extensions,
});

export const signedBlockHeaderSerializer = struct({
	...blockHeaderSerializer.serializers,
	ed_signature: bytes(64),
	rand: sha256,
	cert: vector(blockSignatureSerializer),
});

export const signedBlockSerializer = struct({
	...signedBlockHeaderSerializer.serializers,
	transactions: vector(processedTransactionSerializer),
});
