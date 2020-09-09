import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { struct, vector } from '../collections';

// eslint-disable-next-line import/prefer-default-export
export const blockRewardOperationPropsSerializer = struct({
	fee: asset,
	reciever: accountId,
	assets: vector(asset),
	extensions,
});
