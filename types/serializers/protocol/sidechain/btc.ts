import { asset, extensions } from "../../chain";
import { accountId, btcAddressId, btcIntermediateDepositId } from "../../chain/id/protocol";
import { StructSerializer, SetSerializer } from "../../collections";
import { StringSerializer, integers } from "../../basic";
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

export declare const sidechainBtcDepositOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	account: typeof accountId,
	intermediate_deposit_id: typeof btcIntermediateDepositId,
	tx_info: typeof BtcTransactionDetailsSerializer,
}>;

export declare const sidechainBtcWithdrawOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	btc_addr: StringSerializer,
	value: typeof integers.uint64,
	extensions: typeof extensions,
}>;
