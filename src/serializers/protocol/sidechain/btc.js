import { asset, extensions, sha256 } from '../../chain';
import {
	accountId,
	btcAddressId,
	btcIntermediateDepositId,
	btcDepositId,
	btcWithdrawId,
	btcAggregatingId,
} from '../../chain/id/protocol';
import { btcTransactionDetailsSerializer } from '../../chain/sidechain/btc';
import { struct, set, map, optional } from '../../collections';
import { string as stringSerializer, integers } from '../../basic';
import btcPublicKey from '../btcPublicKey';
import { uint8, uint32 } from '../../basic/integers';

export const sidechainBtcCreateAddressOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	backup_address: stringSerializer,
	extensions,
});


export const sidechainBtcCreateIntermediateDepositOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	account: accountId,
	btc_address_id: btcAddressId,
	tx_info: btcTransactionDetailsSerializer,
	extensions,
});

export const sidechainBtcIntermediateDepositOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	intermediate_address_id: btcIntermediateDepositId,
	signature: stringSerializer,
	extensions,
});

export const sidechainBtcDepositOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	account: accountId,
	intermediate_deposit_id: btcIntermediateDepositId,
	tx_info: btcTransactionDetailsSerializer,
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

