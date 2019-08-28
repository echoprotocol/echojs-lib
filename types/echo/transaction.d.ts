import PrivateKey from "../crypto/private-key";
import PublicKey from "../crypto/public-key";
import OperationId from "../interfaces/OperationId";
import { asset } from "../serializers/chain";
import { SerializerInput, SerializerOutput } from "../serializers/ISerializer";
import { OperationSerializer } from "../serializers/operations";
import { OperationPropsSerializer } from "../serializers/operations/operation";

declare enum OPERATION_RESULT_VARIANT { VOID = 0, OBJECT = 1, ASSET = 2 }

type OPERATION_RESULT<T extends OPERATION_RESULT_VARIANT> = T extends any ? [T, {
	[OPERATION_RESULT_VARIANT.VOID]: null,
	[OPERATION_RESULT_VARIANT.OBJECT]: string,
	[OPERATION_RESULT_VARIANT.ASSET]: SerializerInput<typeof asset>,
}[T]] : never;

interface BroadcastingResult {
	id: string,
	block_num: number,
	trx_num: number,
	trx: {
		ref_block_num: number,
		ref_block_prefix: number,
		expiration: string,
		operations: SerializerOutput<OperationSerializer>[],
		extensions: never[],
		signatures: string[],
		operation_results: OPERATION_RESULT<OPERATION_RESULT_VARIANT>[],
	},
}

export default class Transaction {
	readonly transactionObject: any;

	addOperation<T extends OperationId>(
		operationId: T,
		props?: SerializerInput<OperationPropsSerializer<T>>,
	): Transaction;

	addSigner(privateKey: PrivateKey | Buffer, publicKey?: PublicKey): Transaction;
	getPotentialSignatures(): Promise<{publicKeys:Array<string>}>;
	sign(privateKey?: PrivateKey): Promise<void>;
	broadcast(wasBroadcastedCallback?: () => any): Promise<[BroadcastingResult]>;
	setRequiredFees(assetId: string): Promise<void>;
}
