import PrivateKey from "../crypto/private-key";
import PublicKey from "../crypto/public-key";
import OPERATIONS from "../constants/operations-ids";
import OPERATION_PROPS from "./_operations";

type OPERATION<T extends OPERATIONS> = [T, OPERATION_PROPS[T]];

enum OPERATION_RESULT_VARIANT { VOID = 0, OBJECT = 1, ASSET = 2 };

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
		operation_results: Array<OPERATION_RESULT<OPERATION_RESULT_VARIANT>>,
	},
}

export default class Transaction {
	addOperation<T extends OPERATIONS>(operationId: T, props?: OPERATION_PROPS[T]): Transaction;
	addSigner(privateKey: PrivateKey | Buffer, publicKey?: PublicKey): Transaction;
	sign(privateKey?: PrivateKey | Buffer): Promise<void>;
	broadcast(wasBroadcastedCallback?: () => any): Promise<[BroadcastingResult]>;
}
