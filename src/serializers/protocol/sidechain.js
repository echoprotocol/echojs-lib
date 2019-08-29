import ethAddress from './ethAddress';
import { uint64 } from '../basic/integers';
import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { struct, vector } from '../collections';
import { config } from '../plugins/sidechain';

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

export const sidechainEthDepositOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	deposit_id: uint64,
	account: accountId,
	value: uint64,
	extensions,
});

export const sidechainEthWithdrawOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	eth_addr: ethAddress,
	value: uint64,
	extensions,
});

export const sidechainEthApproveWithdrawOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	withdraw_id: uint64,
	extensions,
});
