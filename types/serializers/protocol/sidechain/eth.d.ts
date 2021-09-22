import ethAddress from "../ethAddress";
import { uint64 } from "../../basic/integers";
import { asset, extensions, sha256 } from "../../chain";
import { accountId, ethDepositId, ethWithdrawId, assetId } from "../../chain/id/protocol";
import { VectorSerializer, StructSerializer } from "../../collections";
import { spvEthBlockHeader, spvEthMerkleProof } from "../../spv/eth";

// sidechain_eth_spv_create_operation
export const sidechainEthSpvCreateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	header: typeof spvEthBlockHeader,
	proofs: VectorSerializer<typeof spvEthMerkleProof>,
	extensions: typeof extensions,
}>;

// sidechain_eth_spv_add_missed_tx_receipt_operation
export const sidechainEthSpvAddMissedTxReceiptOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	reporter: typeof accountId,
	block_hash: typeof sha256,
	proofs: VectorSerializer<typeof spvEthMerkleProof>
	extensions: typeof extensions,
}>;

export declare const sidechainEthCreateAddressOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	extensions: typeof extensions,
}>;

// sidechain_eth_approve_address_operation
export declare const sidechainEthApproveAddressOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	eth_addr: typeof ethAddress,
	transaction_hash: typeof sha256,
	extensions: typeof extensions,
}>;

// sidechain_eth_deposit_operation
export declare const sidechainEthDepositOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
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

// sidechain_eth_approve_withdraw_operation
export declare const sidechainEthApproveWithdrawOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	withdraw_id: typeof uint64,
	transaction_hash: typeof sha256,
	extensions: typeof extensions,
}>;

export declare const sidechainEthUpdateContractAddressOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	new_addr: typeof ethAddress,
	extensions: typeof extensions,
}>;

// sidechain_stake_eth_update_operation
export declare const sidechainStakeEthUpdateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	asset_id: typeof assetId,
	current_balance: typeof uint64,
	account: typeof accountId,
	transaction_hash: typeof sha256,
	extensions: typeof extensions,
}>;
