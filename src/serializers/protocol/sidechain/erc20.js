import ethAddress from '../ethAddress';
import { string as stringSerializer } from '../../basic';
import { uint8, uint64 } from '../../basic/integers';
import { asset, extensions, sha256 } from '../../chain';
import { accountId, erc20TokenId } from '../../chain/id/protocol';
import { struct, vector } from '../../collections';

export const sidechainERC20RegisterTokenOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	eth_addr: ethAddress,
	name: stringSerializer,
	symbol: stringSerializer,
	decimals: uint8,
	extensions,
});

export const sidechainERC20DepositTokenOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	malicious_committeemen: vector(accountId),
	account: accountId,
	erc20_token_addr: ethAddress,
	value: stringSerializer,
	transaction_hash: sha256,
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

export const sidechainERC20ApproveTokenWithdrawOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	withdraw_id: uint64,
	extensions,
});
