import { OBJECT_TYPE } from '../constants/chain-types';
import serializable from './serializable';
import { int64, uint64, bytes, protocolId, publicKey } from './basic-types';

export const asset = serializable({ amount: int64, asset_id: protocolId(OBJECT_TYPE.ASSET) });

export const memoData = serializable({
	from: publicKey,
	to: publicKey,
	nonce: uint64,
	message: bytes(undefined),
});
