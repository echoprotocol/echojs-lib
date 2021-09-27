import { bytes } from '../basic';
import { uint256, uint64, uint8 } from '../basic/integers';
import { sha256 } from '../chain';
import { optional, struct, vector, staticVariant } from '../collections';
import { spvPmTrieNodesRlpData } from './pmTrie';

const logEntry = struct({
	address: bytes(),
	data: bytes(),
	topics: vector(sha256),
});

export const spvTransactionReceipt = struct({
	type: uint8,
	transaction_hash: sha256,
	transaction_index: uint64,
	cumulative_gas_used: uint256,
	logs: vector(logEntry),
	logs_bloom: bytes(),
	status_or_root: staticVariant([uint8, sha256]),
});

export const spvEthBlockHeader = struct({
	parent_hash: sha256,
	sha3_uncles: sha256,
	miner: bytes(),
	state_root: sha256,
	transactions_root: sha256,
	receipts_root: sha256,
	logs_bloom: bytes(),
	difficulty: uint256,
	height: uint64,
	gas_limit: uint256,
	gas_used: uint256,
	timestamp: uint64,
	extra_data: bytes(),
	mix_hash: sha256,
	nonce: bytes(),
	base_fee: optional(uint256),
});

export const spvEthMerkleProof = struct({
	receipt: spvTransactionReceipt,
	path_data: spvPmTrieNodesRlpData,
});
