import { asset, extensions, sha256, ripemd160 } from "../../chain";
import { accountId, btcAddressId, btcDepositId, btcWithdrawId, btcAggregatingId } from "../../chain/id/protocol";
import { StructSerializer, SetSerializer, MapSerializer, VectorSerializer } from "../../collections";
import { StringSerializer, integers, bool } from "../../basic";
import { BtcTransactionDetailsSerializer } from '../../chain/sidechain/btc';
import btcPublicKey from "../btcPublicKey";
import { uint8 } from "../../basic/integers";
import { proofSerializer, spvHeaderBlockSerializer } from "./eth";

// sidechain_btc_spv_create_operation
export declare const sidechainBtcSpvCreateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	header: typeof spvHeaderBlockSerializer,
	proofs: VectorSerializer<typeof proofSerializer>,
	extensions: typeof extensions,
}>;

// sidechain_btc_spv_add_missed_tx_operation
export declare const sidechainBtcSpvAddMissedTxReceiptOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	reporter: typeof accountId,
	block_hash: typeof sha256,
	proofs: VectorSerializer<typeof proofSerializer>,
	extensions: typeof extensions,
}>;

export declare const sidechainBtcCreateAddressOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	extensions: typeof extensions,
}>;

export declare const sidechainBtcDepositOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	btc_address_id: typeof btcAddressId,
	tx_info: typeof BtcTransactionDetailsSerializer,
	extensions: typeof extensions,
}>;

export declare const sidechainBtcWithdrawOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	btc_addr: StringSerializer,
	value: typeof integers.uint64,
	extensions: typeof extensions,
}>;

export declare const sidechainBtcAggregateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	deposits: SetSerializer<typeof btcDepositId>,
	withdrawals: SetSerializer<typeof btcWithdrawId>,
	transaction_id: typeof sha256,
	aggregation_out_value: typeof integers.uint64,
	btc_block_number: typeof integers.uint32,
	sma_address: StructSerializer<{ address: StringSerializer }>,
	committee_member_ids_in_script: MapSerializer<typeof accountId, typeof btcPublicKey>,
	previous_aggregation: typeof btcAggregatingId,
	cpfp_depth: typeof uint8,
	signatures: MapSerializer<typeof integers.uint32, StringSerializer>,
	extensions: typeof extensions,
}>;

export const sidechainBtcApproveAggregateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	transaction_id: typeof sha256,
	block_number: typeof integers.uint32,
	extensions: typeof extensions,
}>;

export const sidechainBtcCreateStakeScriptOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	pubkey_hash: typeof ripemd160,
	extensions: typeof extensions,
}>;

export const sidechainStakeBtcUpdateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	owner: typeof accountId,
	btc_tx_info: typeof BtcTransactionDetailsSerializer,
	is_vin: typeof bool,
	extensions: typeof extensions,
}>;
