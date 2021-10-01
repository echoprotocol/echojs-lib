import { bytes } from '../basic';
import { uint256, uint64, uint8 } from '../basic/integers';
import { sha256With0xPrefix } from '../chain';
import { optional, struct, vector, structWithVariantKeys } from '../collections';
import { spvPmTrieNodesRlpData } from './pmTrie';

const logEntry = struct({
	logIndex: bytes(undefined, true),
	address: bytes(undefined, true),
	data: bytes(undefined, true),
	topics: vector(sha256With0xPrefix),
});

export const spvTransactionReceipt = structWithVariantKeys({
	type: uint8,
	transactionHash: sha256With0xPrefix,
	transactionIndex: uint64,
	cumulativeGasUsed: uint256,
	logs: vector(logEntry),
	logsBloom: bytes(),
}, [{
	keyIndexInStructure: 6,
	serializersData: [['status', uint8], ['root', sha256With0xPrefix]],
}]);

export const spvEthBlockHeader = struct({
	parentHash: sha256With0xPrefix,
	sha3Uncles: sha256With0xPrefix,
	miner: bytes(undefined, true),
	stateRoot: sha256With0xPrefix,
	transactionsRoot: sha256With0xPrefix,
	receiptsRoot: sha256With0xPrefix,
	logsBloom: bytes(undefined, true),
	difficulty: uint256,
	number: uint64,
	gasLimit: uint256,
	gasUsed: uint256,
	timestamp: uint64,
	extraData: bytes(undefined, true),
	mixHash: sha256With0xPrefix,
	nonce: bytes(undefined, true),
	baseFeePerGas: optional(uint256),
});

export const spvEthMerkleProof = struct({
	receipt: spvTransactionReceipt,
	path_data: spvPmTrieNodesRlpData,
});
