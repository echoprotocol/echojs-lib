import ethAddress from '../ethAddress';
import { uint64 } from '../../basic/integers';
import { asset, extensions, sha256 } from '../../chain';
import { accountId, ethDepositId, ethWithdrawId } from '../../chain/id/protocol';
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
	transaction_hash: sha256,
	extensions,
});

export const sidechainEthDepositOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	deposit_id: uint64,
	account: accountId,
	value: uint64,
	transaction_hash: sha256,
	extensions,
});

export const sidechainEthSendDepositOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	deposit_id: ethDepositId,
	extensions,
});

export const sidechainEthWithdrawOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	eth_addr: ethAddress,
	value: uint64,
	extensions,
});

export const sidechainEthSendWithdrawOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	withdraw_id: ethWithdrawId,
	extensions,
});

export const sidechainEthApproveWithdrawOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	withdraw_id: uint64,
	transaction_hash: sha256,
	extensions,
});

export const sidechainEthUpdateContractAddressOperationPropsSerializer = struct({
	fee: asset,
	new_addr: ethAddress,
	extensions,
});
