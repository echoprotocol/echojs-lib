import ethAddress from './ethAddress';
import { string as stringSerializer } from '../basic';
import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { struct } from '../collections';

// eslint-disable-next-line import/prefer-default-export
export const committeeMemberCreateOperationPropsSerializer = struct({
	fee: asset,
	committee_member_account: accountId,
	url: stringSerializer,
	eth_address: ethAddress,
	extensions,
});
