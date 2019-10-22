import ethAddress from './ethAddress';
import btcPublicKey from './btcPublicKey';
import { StringSerializer } from '../basic';
import { asset, extensions } from '../chain';
import { accountId, committeeMemberId } from '../chain/id/protocol';
import { StructSerializer, OptionalSerializer } from '../collections';
import chainParametersSerializer from './chain_parameters';

export const committeeMemberCreateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_account: typeof accountId,
	url: StringSerializer,
	eth_address: typeof ethAddress,
	btc_public_key: typeof btcPublicKey,
	deposit: typeof asset,
	extensions: typeof extensions,
}>;

export const committeeMemberUpdateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member: typeof committeeMemberId,
	committee_member_account: typeof accountId,
	new_url: OptionalSerializer<StringSerializer>,
	new_eth_address: OptionalSerializer<typeof ethAddress>,
	new_btc_public_key: OptionalSerializer<typeof btcPublicKey>,
	extensions: typeof extensions,
}>;

export const committeeMemberUpdateGlobalParametersOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	new_parameters: typeof chainParametersSerializer,
	extensions: typeof extensions,
}>;


export const committeeMemberActivateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_to_activate: typeof committeeMemberId,
	extensions: typeof extensions,
}>;

export const committeeMemberDeactivateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_to_deactivate: typeof committeeMemberId,
	extensions: typeof extensions,
}>;

