import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { struct } from '../collections';
import { int64 } from '../basic/integers';

// eslint-disable-next-line import/prefer-default-export
export const blockRewardOperationPropsSerializer = struct({
	fee: asset,
	reciever: accountId,
	amount: int64,
	extensions,
});
