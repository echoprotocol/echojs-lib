import ethAddress from "../ethAddress";
import { uint64 } from "../../basic/integers";
import { asset, extensions, sha256 } from "../../chain";

import {accountId, ethDepositId, ethWithdrawId} from "../../chain/id/protocol";
import { VectorSerializer, StructSerializer } from "../../collections";

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
	transaction_hash: typeof sha256,
	extensions: typeof extensions,
}>;

export declare const sidechainEthDepositOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	deposit_id: typeof uint64,
	account: typeof accountId,
	value: typeof uint64,
	transaction_hash: typeof sha256,
	extensions: typeof extensions,
}>;

export declare const sidechainEthSendDepositOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	deposit_id: typeof ethDepositId,
	extensions: typeof extensions,
}>;

export declare const sidechainEthWithdrawOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	eth_addr: typeof ethAddress,
	value: typeof uint64,
	extensions: typeof extensions,
}>;

export declare const sidechainEthSendWithdrawOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	withdraw_id: typeof ethWithdrawId,
	extensions: typeof extensions,
}>;

export declare const sidechainEthApproveWithdrawOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	withdraw_id: typeof uint64,
	transaction_hash: typeof sha256,
	extensions: typeof extensions,
}>;

export declare const sidechainEthUpdateContractAddressOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	new_addr: typeof ethAddress,
	extensions: typeof extensions,
}>;
