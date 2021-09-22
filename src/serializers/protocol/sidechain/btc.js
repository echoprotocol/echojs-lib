import { asset, extensions, sha256, ripemd160 } from '../../chain';
import {
	accountId,
	btcAddressId,
	btcDepositId,
	btcWithdrawId,
	btcAggregatingId,
} from '../../chain/id/protocol';
import { btcTransactionDetailsSerializer } from '../../chain/sidechain/btc';
import { struct, set, map, optional, vector } from '../../collections';
import { string as stringSerializer, integers, bool } from '../../basic';
import btcPublicKey from '../btcPublicKey';
import { uint8, uint32 } from '../../basic/integers';
import { spvBtcMerkleProofSerializer } from '../../spv/btc';

// sidechain_btc_spv_create_operation
export const sidechainBtcSpvCreateOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	header: spvBtcBlockHeaderSerializer,
	proofs: vector(spvBtcMerkleProofSerializer),
	extensions,
});

// sidechain_btc_spv_add_missed_tx_operation
export const sidechainBtcSpvAddMissedTxReceiptOperationPropsSerializer = struct({
	fee: asset,
	reporter: accountId,
	block_hash: sha256,
	proofs: vector(spvBtcMerkleProofSerializer),
	extensions,
});

export const sidechainBtcCreateAddressOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	extensions,
});

export const sidechainBtcDepositOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	btc_address_id: btcAddressId,
	tx_info: btcTransactionDetailsSerializer,
	extensions,
});

export const sidechainBtcWithdrawOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	btc_addr: stringSerializer,
	value: integers.uint64,
	extensions,
});

export const sidechainBtcAggregateOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	deposits: set(btcDepositId),
	withdrawals: set(btcWithdrawId),
	transaction_id: sha256,
	sma_address: struct({ address: stringSerializer }),
	committee_member_ids_in_script: map(accountId, btcPublicKey),
	aggregation_out_value: integers.uint64,
	btc_block_number: uint32,
	previous_aggregation: optional(btcAggregatingId),
	cpfp_depth: uint8,
	signatures: map(integers.uint32, stringSerializer),
	extensions,
});

export const sidechainBtcApproveAggregateOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	transaction_id: sha256,
	btc_block_number: uint32,
	extensions,
});

export const sidechainBtcCreateStakeScriptOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	pubkey_hash: ripemd160,
	extensions,
});

export const sidechainStakeBtcUpdateOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	owner: accountId,
	btc_tx_info: btcTransactionDetailsSerializer,
	is_vin: bool,
	extensions,
});
