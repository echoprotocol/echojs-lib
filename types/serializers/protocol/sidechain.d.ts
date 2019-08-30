import ethAddress from './ethAddress';
import { uint64, uint8 } from '../basic/integers';
import { asset, extensions, sha256 } from '../chain';
import { accountId, depositEthId, withdrawEthId } from '../chain/id/protocol';
import { StructSerializer, VectorSerializer } from '../collections';
import { config } from '../plugins/sidechain';
import { StringSerializer } from '../basic';

export declare const sidechainChangeConfigOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	registrar: typeof accountId,
	new_config: typeof config,
	extensions: typeof extensions,
}>;

export declare const sidechainEthCreateAddressOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	extensions: typeof extensions,
}>;

export declare const sidechainEthApproveAddressOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	malicious_committeemen: VectorSerializer<typeof accountId>,
	account: typeof accountId,
	eth_addr: typeof ethAddress,
	extensions: typeof extensions,
}>;

export declare const sidechainEthDepositOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	deposit_id: typeof uint64,
	account: typeof accountId,
	value: typeof uint64,
	extensions: typeof extensions,
}>;

export declare const sidechainEthWithdrawOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	eth_addr: typeof ethAddress,
	value: typeof uint64,
	extensions: typeof extensions,
}>;

export declare const sidechainEthApproveWithdrawOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	withdraw_id: typeof uint64,
	extensions: typeof extensions,
}>;

export declare const sidechainEthIssueOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	value: typeof asset,
	account: typeof accountId,
	deposit_id: typeof depositEthId,
	extensions: typeof extensions,
}>;

export declare const sidechainEthBurnOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	value: typeof asset,
	account: typeof accountId,
	withdraw_id: typeof withdrawEthId,
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
	committee_member_id: typeof accountId,
	malicious_committeemen: VectorSerializer<typeof accountId>,
	account: typeof accountId,
	erc20_token_addr: typeof ethAddress,
	value: StringSerializer,
	transaction_hash: typeof sha256,
	extensions: typeof extensions,
}>;
