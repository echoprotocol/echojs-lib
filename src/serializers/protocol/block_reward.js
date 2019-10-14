import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { struct, map } from '../collections';
import { int64 } from '../basic/integers';

export const blockRewardOperationPropsSerializer = struct({
	fee: asset,
	rewards: map(accountId, int64),
	extensions,
});

export default blockRewardOperationPropsSerializer;
