<<<<<<< HEAD
import { asset, extensions, sha256 } from "../../chain";
import { accountId, btcAddressId, btcIntermediateDepositId, btcDepositId, btcWithdrawId } from "../../chain/id/protocol";
import { StructSerializer, SetSerializer, MapSerializer } from "../../collections";
=======
import { asset, extensions } from "../../chain";
import { accountId, btcAddressId, btcIntermediateDepositId } from "../../chain/id/protocol";
import { StructSerializer, SetSerializer } from "../../collections";
>>>>>>> 2402244c311ea55c2d0131fd0b67a9e38488ba2a
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
<<<<<<< HEAD

export declare const sidechainBtcAggregateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	deposits: SetSerializer<typeof btcDepositId>,
	withdrawals: SetSerializer<typeof btcWithdrawId>,
	transaction_id: typeof sha256,
	sma_out_value: typeof integers.uint64,
	sma_address: StructSerializer<{ address: StringSerializer }>,
	committee_member_ids_in_script: SetSerializer<typeof accountId>,
	signatures: MapSerializer<typeof integers.uint32, StringSerializer>,
	extensions: typeof extensions,	
}>;

export declare const sidechainBtcApproveWithdrawOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	committee_member_id: typeof accountId,
	withdraw_id: typeof btcWithdrawId,
	extensions: typeof extensions,	
}>;
=======
>>>>>>> 2402244c311ea55c2d0131fd0b67a9e38488ba2a
