import { asset, extensions } from '../../chain';
import { accountId, btcAddressId } from '../../chain/id/protocol';
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
	intermediate_address: '', // echo::sidechain::btc::p2sh_p2wsh
	committee_member_ids_in_script: set(accountId),
	signature: stringSerializer,
	extensions,
});
