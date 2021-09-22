import ethAddress from "../ethAddress";
import { BoolSerializer, StringSerializer } from "../../basic";
import { uint8, uint64 } from "../../basic/integers";
import { asset, extensions, sha256 } from "../../chain";
import { accountId, erc20TokenId, depositErc20TokenId, withdrawErc20TokenId } from "../../chain/id/protocol";
import { StructSerializer } from "../../collections";

export declare const sidechainERC20RegisterContractOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	code: StringSerializer,
	args: StringSerializer,
	address: typeof ethAddress,
	name: StringSerializer,
	symbol: StringSerializer,
	decimals: typeof uint8,
	eth_accuracy: BoolSerializer,
	extensions: typeof extensions,
}>;

export declare const sidechainERC20RegisterTokenOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	eth_addr: typeof ethAddress,
	name: StringSerializer,
	symbol: StringSerializer,
	decimals: typeof uint8,
	extensions: typeof extensions,
}>;

export declare const sidechainERC20DepositTokenOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	erc20_token_addr: typeof ethAddress,
	value: StringSerializer,
	transaction_hash: typeof sha256,
	extensions: typeof extensions,
}>;

export declare const sidechainERC20SendDepositTokenOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	deposit_id: typeof depositErc20TokenId,
	extensions: typeof extensions,
}>;

export declare const sidechainERC20WithdrawTokenOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	to: typeof ethAddress,
	erc20_token: typeof erc20TokenId,
	value: StringSerializer,
	extensions: typeof extensions,
}>;

export declare const sidechainERC20SendWithdrawTokenOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	deposit_id: typeof depositErc20TokenId,
	extensions: typeof extensions,
}>;

export declare const sidechainERC20ApproveTokenWithdrawOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	withdraw_id: typeof uint64,
	transaction_hash: typeof sha256,
	extensions: typeof extensions,
}>;

export declare const sidechainERC20IssueOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	deposit: typeof depositErc20TokenId,
	account: typeof accountId,
	token: typeof erc20TokenId,
	amount: StringSerializer,
	extensions: typeof extensions,
}>;

export declare const sidechainERC20BurnOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	withdraw: typeof withdrawErc20TokenId,
	account: typeof accountId,
	token: typeof erc20TokenId,
	amount: StringSerializer,
	extensions: typeof extensions,
}>;

export declare const sidechainERC20TransferAssetOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	to: typeof ethAddress,
	value: typeof asset,
	extensions: typeof extensions,
}>;
