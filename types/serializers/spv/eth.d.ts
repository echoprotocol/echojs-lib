import { BytesSerializer } from "../basic";
import { uint256, uint64 } from "../basic/integers";
import { sha256 } from "../chain";
import { OptionalSerializer, StructSerializer } from "../collections";
import { evmTransactionReceipt } from "../evm";
import { spvPmTrieNodesRlpData } from "./pmTrie";

export const spvEthBlockHeader: StructSerializer<{
	parentHash: typeof sha256,
	sha3Uncles: typeof sha256,
	miner: BytesSerializer,
	stateRoot: typeof sha256,
	transactionsRoot: typeof sha256,
	receiptsRoot: typeof sha256,
	logsBloom: BytesSerializer,
	difficulty: typeof uint256,
	number: typeof uint64,
	gasLimit: typeof uint256,
	gasUsed: typeof uint256,
	timestamp: typeof uint64,
	extraData: BytesSerializer,
	mixHash: typeof sha256,
	nonce: BytesSerializer,
	baseFeePerGas: OptionalSerializer<typeof uint256>,
}>;

export const spvEthMerkleProof: StructSerializer<{
	receipt: typeof evmTransactionReceipt,
	path_data: typeof spvPmTrieNodesRlpData,
}>;
