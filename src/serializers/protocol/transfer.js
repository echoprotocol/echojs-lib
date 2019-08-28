import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { struct } from '../collections';

const transferOperationPropsSerializer = struct({
	fee: asset,
	from: accountId,
	to: accountId,
	amount: asset,
	extensions,
});

export default transferOperationPropsSerializer;
