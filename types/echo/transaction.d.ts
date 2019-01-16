import { OPERATIONS_IDS } from "../constants";
import PrivateKey from "../crypto/private-key";

type int64 = string | number;
type uint64 = string | number;

interface Asset {
	asset_id: string;
	amount: int64;
}

type OPERATIONS_PROPS = {
	[OPERATIONS_IDS.CREATE_CONTRACT]: {
		fee?: Asset,
		registrar: string,
		value: Asset,
		gasPrice: uint64,
		gas: uint64,
		code: string,
		eth_accuracy: boolean,
		supported_asset_id?: string,
	},
};

type OPERATION<T extends OPERATIONS_IDS> = [T, OPERATIONS_PROPS[T]];

enum OPERATION_RESULT_VARIANT { VOID = 0, OBJECT = 1, ASSET = 2 };

// TODO: check second element on all result variants
type OPERATION_RESULT<T extends OPERATION_RESULT_VARIANT> = [T, {
	[OPERATION_RESULT_VARIANT.VOID]: null,
	[OPERATION_RESULT_VARIANT.OBJECT]: string,
	[OPERATION_RESULT_VARIANT.ASSET]: Asset,
}[T]];

interface BroadcastingResult {
	id: string,
	block_num: number,
	trx_num: number,
	trx: {
		ref_block_num: number,
		ref_block_prefix: number,
		expiration: string,
		operations: Array<OPERATION>,
		extensions: Array<void>,
		signatures: Array<string>,
		operation_results: Array<OPERATION_RESULT>,
	},
}

export default class Transaction {
	addOperation<T extends OPERATIONS_IDS>(operationId: T, props?: OPERATIONS_PROPS[T]): Transaction;
	sign(privateKey?: PrivateKey): Promise<void>;
	broadcast(wasBroadcastedCallback?: () => any): Promise<[BroadcastingResult]>;
}