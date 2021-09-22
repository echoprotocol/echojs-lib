import { bytes } from '../basic';
import { uint256, uint64 } from '../basic/integers';
import { sha256 } from '../chain';
import { optional, struct } from '../collections';
import { evmTransactionReceipt } from '../evm';
import { spvPmTrieNodesRlpData } from './pmTrie';

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
	receipt: evmTransactionReceipt,
	path_data: spvPmTrieNodesRlpData,
});
