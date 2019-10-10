import { asset, extensions, sha256 } from '../../chain';
import {
	accountId,
	btcAddressId,
	btcIntermediateDepositId,
	btcDepositId,
	btcWithdrawId,
} from '../../chain/id/protocol';
import { btcTransactionDetailsSerializer } from '../../chain/sidechain/btc';
import { struct, set, map } from '../../collections';
import { string as stringSerializer, integers } from '../../basic';

export const sidechainBtcCreateAddressOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	backup_address: stringSerializer,
});


export const sidechainBtcIntermediateDepositOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	account: accountId,
	btc_address_id: btcAddressId,
	deposit_details: btcTransactionDetailsSerializer,
	intermediate_address: struct({ address: stringSerializer }),
	committee_member_ids_in_script: set(accountId),
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
	sma_out_value: integers.uint64,
	sma_address: struct({ address: stringSerializer }),
	committee_member_ids_in_script: set(accountId),
	signatures: map(integers.uint32, stringSerializer),
	extensions,
});

export const sidechainBtcApproveWithdrawOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	withdraw_id: btcWithdrawId,
	extensions,
});
