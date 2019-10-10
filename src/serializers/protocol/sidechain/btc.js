import { asset, extensions } from '../../chain';
import { accountId, btcAddressId, btcIntermediateDepositId } from '../../chain/id/protocol';
import { btcTransactionDetailsSerializer } from '../../chain/sidechain/btc';
import { struct, set } from '../../collections';
import { string as stringSerializer } from '../../basic';

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

