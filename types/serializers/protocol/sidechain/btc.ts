import { asset, extensions } from "../../chain";
<<<<<<< HEAD
import { accountId, btcAddressId, btcIntermeiateDepositId } from "../../chain/id/protocol";
=======
import { accountId, btcAddressId } from "../../chain/id/protocol";
>>>>>>> develop
import { StructSerializer, SetSerializer } from "../../collections";
import { StringSerializer } from "../../basic";
import { BtcTransactionDetailsSerializer } from '../../chain/sidechain/btc';

export declare const sidechainBtcCreateAddressOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	backup_address: StringSerializer,
}>;

export declare const sidechainBtcIntermediateDepositOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	account: typeof accountId,
	btc_address_id: typeof btcAddressId,
	deposit_details: typeof BtcTransactionDetailsSerializer,
	intermediate_address: StructSerializer<{ address: StringSerializer }>,
	committee_member_ids_in_script: SetSerializer<typeof accountId>,
	signature: StringSerializer,
	extensions: typeof extensions,
}>;
<<<<<<< HEAD

export declare const sidechainBtcDepositOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	account: typeof accountId,
	intermediate_deposit_id: typeof btcIntermeiateDepositId,
	tx_info: typeof BtcTransactionDetailsSerializer,
}>;

=======
>>>>>>> develop
