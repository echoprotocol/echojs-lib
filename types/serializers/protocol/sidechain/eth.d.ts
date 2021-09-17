import ethAddress from "../ethAddress";
import { uint64, uint256, uint8 } from "../../basic/integers";
import { asset, extensions, sha256 } from "../../chain";

import { accountId, ethDepositId, ethWithdrawId, assetId } from "../../chain/id/protocol";
import { VectorSerializer, StructSerializer, OptionalSerializer } from "../../collections";
import { BytesSerializer, StringSerializer, VariantObjectSerializer } from "../../basic";
import PairSerializer from "../../collections/Pair";

declare const spvHeaderBlockSerializer: StructSerializer<{
	parent_hash: typeof sha256,
	sha3_uncles: typeof sha256,
	miner: BytesSerializer,
	state_root: typeof sha256,
	transactions_root: typeof sha256,
	receipts_root: typeof sha256,
	logs_bloom: BytesSerializer,
	difficulty: typeof uint256,
	height: typeof uint64,
	gas_limit: typeof uint256,
	gas_used: typeof uint256,
	timestamp: typeof uint64,
	extra_data: BytesSerializer,
	mix_hash: typeof sha256,
	nonce: BytesSerializer,
	base_fee: OptionalSerializer<typeof uint256>,
}>;

declare const proofSerializer: StructSerializer<{
	receipt: StructSerializer<{
		type: typeof uint8,
		transaction_hash: typeof sha256,
		transaction_index: typeof uint64,
		cumulative_gas_used: typeof uint256,
		logs: VectorSerializer<StructSerializer<{
			log_index: StringSerializer,
			address: BytesSerializer,
			data: BytesSerializer,
			topics: VectorSerializer<typeof sha256>,
		}>>,
		logs_bloom: BytesSerializer
		status_or_root: VariantObjectSerializer,
	}>;
	path_data: VectorSerializer<PairSerializer<VectorSerializer<OptionalSerializer<BytesSerializer>>, OptionalSerializer<StringSerializer>>>,
}>;

export const sidechainEthSpvCreateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	header: typeof spvHeaderBlockSerializer,
	proofs: VectorSerializer<typeof proofSerializer>,
	extensions: typeof extensions,
}>;

export const sidechainEthSpvAddMissedTxReceiptOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	reporter: typeof accountId,
	block_hash: typeof sha256,
	proofs: VectorSerializer<typeof proofSerializer>
	extensions: typeof extensions,
}>;

export declare const sidechainEthCreateAddressOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	extensions: typeof extensions,
}>;

export declare const sidechainEthApproveAddressOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	eth_addr: typeof ethAddress,
	transaction_hash: typeof sha256,
	extensions: typeof extensions,
}>;

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

export declare const sidechainStakeEthUpdateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	asset_id: typeof assetId,
	current_balance: typeof uint64,
	account: typeof accountId,
	transaction_hash: typeof sha256,
	extensions: typeof extensions,
}>;
