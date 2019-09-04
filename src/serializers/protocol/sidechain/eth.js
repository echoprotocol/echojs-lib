import ethAddress from '../ethAddress';
import { uint64 } from '../../basic/integers';
import { asset, extensions } from '../../chain';
import { accountId, depositEthId, withdrawEthId } from '../../chain/id/protocol';
import { struct, vector } from '../../collections';

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

export const sidechainEthIssueOperationPropsSerializer = struct({
	fee: asset,
	value: asset,
	account: accountId,
	deposit_id: depositEthId,
	extensions,
});

export const sidechainEthBurnOperationPropsSerializer = struct({
	fee: asset,
	value: asset,
	account: accountId,
	withdraw_id: withdrawEthId,
	extensions,
});