import PrivateKey from "../crypto/private-key";
import PublicKey from "../crypto/public-key";
import OperationId from "../interfaces/OperationId";

type int64 = string | number;
type uint64 = string | number;

interface Asset {
	asset_id: string;
	amount: int64;
}

type KNOWN_OPERATIONS_PROPS = {
	[OperationId.TRANSFER]: {
		fee?: Asset,
		from: string,
		to: string,
		amount: Asset,
		// memo?: void,
		extensions?: never[],
	},
	[OperationId.CONTRACT_CREATE]: {
		fee?: Asset,
		registrar: string,
		value: Asset,
		code: string,
		eth_accuracy: boolean,
		supported_asset_id?: string,
		extensions?: never[];
	},
	[OperationId.CONTRACT_CALL]: {
		fee: Asset,
		registrar: string,
		value: Asset,
		code: string,
		callee: string,
	},
};

type OPERATION_PROPS<T extends OperationId> = T extends keyof KNOWN_OPERATIONS_PROPS ?
	KNOWN_OPERATIONS_PROPS[T] : unknown;

type OPERATION<T extends OperationId> = [T, OPERATION_PROPS<T>];

declare enum OPERATION_RESULT_VARIANT { VOID = 0, OBJECT = 1, ASSET = 2 }

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
		operations: OPERATION<OperationId>[],
		extensions: unknown[],
		signatures: string[],
		operation_results: OPERATION_RESULT<OPERATION_RESULT_VARIANT>[],
	},
}

export default class Transaction {
	addOperation<T extends OperationId>(operationId: T, props?: OPERATION_PROPS<T>): Transaction;
	addSigner(privateKey: PrivateKey | Buffer, publicKey?: PublicKey): Transaction;
	getPotentialSignatures(): Promise<{publicKeys:Array<string>}>;
	sign(privateKey?: PrivateKey): Promise<void>;
	broadcast(wasBroadcastedCallback?: () => any): Promise<[BroadcastingResult]>;
	setRequiredFees(assetId: string): Promise<void>;
}
