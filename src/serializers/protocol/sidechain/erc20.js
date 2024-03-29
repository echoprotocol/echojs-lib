import ethAddress from '../ethAddress';
import { bool, string as stringSerializer } from '../../basic';
import { uint8, uint64 } from '../../basic/integers';
import { asset, extensions, sha256 } from '../../chain';
import { accountId, erc20TokenId, depositErc20TokenId, withdrawErc20TokenId } from '../../chain/id/protocol';
import { struct } from '../../collections';

export const sidechainERC20RegisterContractOperationPropsSerializer = struct({
	fee: asset,
	code: stringSerializer,
	args: stringSerializer,
	address: ethAddress,
	name: stringSerializer,
	symbol: stringSerializer,
	decimals: uint8,
	eth_accuracy: bool,
	extensions,
});

export const sidechainERC20RegisterTokenOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	eth_addr: ethAddress,
	name: stringSerializer,
	symbol: stringSerializer,
	decimals: uint8,
	extensions,
});

// sidechain_erc20_deposit_token_operation
export const sidechainERC20DepositTokenOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	erc20_token_addr: ethAddress,
	value: stringSerializer,
	transaction_hash: sha256,
	extensions,
});

export const sidechainERC20SendDepositTokenOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	deposit_id: depositErc20TokenId,
	extensions,
});

export const sidechainERC20WithdrawTokenOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	to: ethAddress,
	erc20_token: erc20TokenId,
	value: stringSerializer,
	extensions,
});

export const sidechainERC20SendWithdrawTokenOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	deposit_id: depositErc20TokenId,
	extensions,
});

// sidechain_erc20_approve_token_withdraw_operation
export const sidechainERC20ApproveTokenWithdrawOperationPropsSerializer = struct({
	fee: asset,
	withdraw_id: uint64,
	transaction_hash: sha256,
	extensions,
});

export const sidechainERC20IssueOperationPropsSerializer = struct({
	fee: asset,
	deposit: depositErc20TokenId,
	account: accountId,
	token: erc20TokenId,
	amount: stringSerializer,
	extensions,
});

export const sidechainERC20BurnOperationPropsSerializer = struct({
	fee: asset,
	withdraw: withdrawErc20TokenId,
	account: accountId,
	token: erc20TokenId,
	amount: stringSerializer,
	extensions,
});

export const sidechainERC20TransferAssetOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	to: ethAddress,
	value: asset,
	extensions,
});
