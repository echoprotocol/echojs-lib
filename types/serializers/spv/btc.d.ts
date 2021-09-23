import { bool } from "../basic";
import { int32, uint32 } from "../basic/integers";
import { sha256 } from "../chain";
import { sidechainBtcTransaction } from "../chain/sidechain/btc";
import { StructSerializer, VectorSerializer } from "../collections";

declare const merkleLeaf: StructSerializer<{
	leaf: typeof sha256,
	is_left: typeof bool,
}>;

declare const merklePath: StructSerializer<{ leafs: VectorSerializer<typeof merkleLeaf> }>;

export const spvBtcBlockHeaderSerializer: StructSerializer<{
	version: typeof int32,
	prev_block_hash: typeof sha256,
	merkle_root: typeof sha256,
	timestamp: typeof uint32,
	bits: typeof uint32,
	nonce: typeof uint32,
	height: typeof uint32,
}>;

export const spvBtcMerkleProofSerializer: StructSerializer<{
	tx: typeof sidechainBtcTransaction,
	path: typeof merklePath,
}>;

