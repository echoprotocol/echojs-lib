import { bytes } from '../basic';
import { uint256, uint64 } from '../basic/integers';
import { sha256 } from '../chain';
import { optional, struct } from '../collections';
import { evmTransactionReceipt } from '../evm';
import { spvPmTrieNodesRlpData } from './pmTrie';

export const spvEthBlockHeader = struct({
	parentHash: sha256,
	sha3Uncles: sha256,
	miner: bytes(),
	stateRoot: sha256,
	transactionsRoot: sha256,
	receiptsRoot: sha256,
	logsBloom: bytes(),
	difficulty: uint256,
	number: uint64,
	gasLimit: uint256,
	gasUsed: uint256,
	timestamp: uint64,
	extraData: bytes(),
	mixHash: sha256,
	nonce: bytes(),
	baseFeePerGas: optional(uint256),
});

export const spvEthMerkleProof = struct({
	receipt: evmTransactionReceipt,
	path_data: spvPmTrieNodesRlpData,
});
