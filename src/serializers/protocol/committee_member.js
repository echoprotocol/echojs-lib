import ethAddress from './ethAddress';
import { string as stringSerializer } from '../basic';
import { asset, extensions } from '../chain';
import { accountId, committeeMemberId } from '../chain/id/protocol';
import { struct, optional } from '../collections';

export const committeeMemberCreateOperationPropsSerializer = struct({
	fee: asset,
	committee_member_account: accountId,
	url: stringSerializer,
	eth_address: ethAddress,
	extensions,
});

export const committeeMemberUpdateOperationPropsSerializer = struct({
	fee: asset,
	committee_member: committeeMemberId,
	committee_member_account: accountId,
	new_url: optional(stringSerializer),
	new_eth_address: optional(ethAddress),
	extensions,
});
