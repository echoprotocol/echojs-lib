import ethAddress from './ethAddress';
import { StringSerializer } from '../basic';
import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { StructSerializer } from '../collections';

export const committeeMemberCreateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_account: typeof accountId,
	url: StringSerializer,
	eth_address: typeof ethAddress,
	extensions: typeof extensions,
}>;
