import { BytesSerializer } from "../basic";
import { uint256, uint64, uint8 } from "../basic/integers";
import { sha256 } from "../chain";
import { OptionalSerializer, StructSerializer, StaticVariantSerializer, VectorSerializer } from "../collections";
import { spvPmTrieNodesRlpData } from "./pmTrie";


declare const logEntry: StructSerializer<{
	address: BytesSerializer,
	data: BytesSerializer,
	topics: VectorSerializer<typeof sha256>,
}>;

export const spvTransactionReceipt: StructSerializer<{
	type: typeof uint8,
	transaction_hash: typeof sha256,
	transaction_index: typeof uint64,
	cumulative_gas_used: typeof uint256,
	logs: VectorSerializer<typeof logEntry>,
	logs_bloom: BytesSerializer,
	status_or_root: StaticVariantSerializer<[typeof uint8, typeof sha256]>,
}>;

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
	receipt: typeof spvTransactionReceipt,
	path_data: typeof spvPmTrieNodesRlpData,
}>;
