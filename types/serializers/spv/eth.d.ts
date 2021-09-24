import { BytesSerializer } from "../basic";
import { uint256, uint64 } from "../basic/integers";
import { sha256 } from "../chain";
import { OptionalSerializer, StructSerializer } from "../collections";
import { evmTransactionReceipt } from "../evm";
import { spvPmTrieNodesRlpData } from "./pmTrie";

export const spvEthBlockHeader: StructSerializer<{
	parent_hash: typeof sha256,
	sha3_uncles: typeof sha256,
	miner: BytesSerializer,
	state_root: typeof sha256,
	transactions_root: typeof sha256,
	receipts_root: typeof sha256,
	logs_bloom: BytesSerializer,
	difficulty: typeof uint256,
	height: typeof uint64,
	gas_limit: typeof uint256,
	gas_used: typeof uint256,
	timestamp: typeof uint64,
	extra_data: BytesSerializer,
	mix_hash: typeof sha256,
	nonce: BytesSerializer,
	base_fee: OptionalSerializer<typeof uint256>,
}>;

export const spvEthMerkleProof: StructSerializer<{
	receipt: typeof evmTransactionReceipt,
	path_data: typeof spvPmTrieNodesRlpData,
}>;
