import { bool } from "../basic";
import { int32, uint32 } from "../basic/integers";
import { sha256 } from "../chain";
import { sidechainBtcTransaction } from "../chain/sidechain/btc";
import { struct, vector } from "../collections";

const merkleLeaf = struct({
	leaf: sha256,
	is_left: bool,
});

const merklePath = struct({ leafs: vector(merkleLeaf) });

export const spvBtcBlockHeaderSerializer = struct({
	version: int32,
	prev_block_hash: sha256,
	merkle_root: sha256,
	timestamp: uint32,
	bits: uint32,
	nonce: uint32,
	height: uint32,
});

export const spvBtcMerkleProofSerializer = struct({
	tx: sidechainBtcTransaction,
	path: merklePath,
});
