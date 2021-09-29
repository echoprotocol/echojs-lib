import { BytesSerializer } from "../basic";
import { uint256, uint64, uint8 } from "../basic/integers";
import { sha256With0xPrefix } from "../chain";
import { OptionalSerializer, StructSerializer, StaticVariantSerializer, VectorSerializer } from "../collections";
import { spvPmTrieNodesRlpData } from "./pmTrie";


declare const logEntry: StructSerializer<{
	logIndex: BytesSerializer,
	address: BytesSerializer,
	data: BytesSerializer,
	topics: VectorSerializer<typeof sha256With0xPrefix>,
}>;

export const spvTransactionReceipt: StructSerializer<{
	type: typeof uint8,
	transactionHash: typeof sha256With0xPrefix,
	transactionIndex: typeof uint64,
	cumulativeGasUsed: typeof uint256,
	logs: VectorSerializer<typeof logEntry>,
	logsBloom: BytesSerializer,
	statusOrRoot: StaticVariantSerializer<[typeof uint8, typeof sha256With0xPrefix]>,
	status: OptionalSerializer<typeof uint8>,
	root: OptionalSerializer<typeof sha256With0xPrefix>,
}>;

export const spvEthBlockHeader: StructSerializer<{
	parentHash: typeof sha256With0xPrefix,
	sha3Uncles: typeof sha256With0xPrefix,
	miner: BytesSerializer,
	stateRoot: typeof sha256With0xPrefix,
	transactionsRoot: typeof sha256With0xPrefix,
	receiptsRoot: typeof sha256With0xPrefix,
	logsBloom: BytesSerializer,
	difficulty: typeof uint256,
	number: typeof uint64,
	gasLimit: typeof uint256,
	gasUsed: typeof uint256,
	timestamp: typeof uint64,
	extraData: BytesSerializer,
	mixHash: typeof sha256With0xPrefix,
	nonce: BytesSerializer,
	baseFeePerGas: OptionalSerializer<typeof uint256>,
}>;

export const spvEthMerkleProof: StructSerializer<{
	receipt: typeof spvTransactionReceipt,
	path_data: typeof spvPmTrieNodesRlpData,
}>;
