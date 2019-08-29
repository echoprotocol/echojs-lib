import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { struct, vector } from '../collections';
import { config } from '../plugins/sidechain';
import ethAddress from './ethAddress';

export const sidechainChangeConfigOperationPropsSerializer = struct({
	fee: asset,
	registrar: accountId,
	new_config: config,
	extensions,
});

export const sidechainEthCreateAddressOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	extensions,
});

export const sidechainEthApproveAddressOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	malicious_committeemen: vector(accountId),
	account: accountId,
	eth_addr: ethAddress,
	extensions,
});
