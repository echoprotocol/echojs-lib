import ethAddress from './ethAddress';
import btcPublicKey from './btcPublicKey';
import { string as stringSerializer } from '../basic';
import { asset, extensions } from '../chain';
import { accountId, committeeMemberId } from '../chain/id/protocol';
import { struct, optional } from '../collections';
import chainParametersSerializer from './chain_parameters';

export const committeeMemberCreateOperationPropsSerializer = struct({
	fee: asset,
	committee_member_account: accountId,
	url: stringSerializer,
	eth_address: ethAddress,
	btc_public_key: btcPublicKey,
	deposit: asset,
	extensions,
});

export const committeeMemberUpdateOperationPropsSerializer = struct({
	fee: asset,
	committee_member: committeeMemberId,
	committee_member_account: accountId,
	new_url: optional(stringSerializer),
	new_eth_address: optional(ethAddress),
	new_btc_public_key: optional(btcPublicKey),
	extensions,
});

export const committeeMemberUpdateGlobalParametersOperationPropsSerializer = struct({
	fee: asset,
	new_parameters: chainParametersSerializer,
	extensions,
});

export const committeeMemberActivateOperationPropsSerializer = struct({
	fee: asset,
	committee_to_activate: committeeMemberId,
	extensions,
});

export const committeeMemberDeactivateOperationPropsSerializer = struct({
	fee: asset,
	committee_to_deactivate: committeeMemberId,
	extensions,
});
