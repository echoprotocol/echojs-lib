import { OPERATIONS_IDS } from "../constants";
import PrivateKey from "../crypto/private-key";
import Echo from "../echo";
import Transaction from "../echo/transaction";
import { uint64 } from "../serializers/basic/integers";
import { asset } from "../serializers/chain";
import { contract } from "../serializers/protocol";
import Contract from "./Contract";

declare enum MethodType { CREATE = 'create', CALL = 'call' }

type OperationOptions<T extends MethodType> = {
	fee?: { amount?: typeof uint64['__TInput__'], assetId?: string };
	registrar?: string;
	value?: typeof uint64['__TInput__'] | { amount?: typeof uint64['__TInput__'], assetId?: string };
} & (T extends MethodType.CREATE ? {
	ethAccuracy?: boolean;
	supportedAssetId?: string;
} : T extends MethodType.CALL ? {
	callee?: string
} : never);

type RawOperation<T extends MethodType> =
	T extends MethodType.CREATE ? typeof contract.create['__TOutput__'] :
	T extends MethodType.CALL ? typeof contract.call['__TOutput__'] :
	never;

type OperationId<T extends MethodType> = {
	create: typeof OPERATIONS_IDS['CONTRACT_CREATE'],
	call: typeof OPERATIONS_IDS['CONTRACT_CALL'],
}[T];

interface OptionsWithEcho { echo?: Echo }

declare abstract class Method<T extends MethodType> {
	readonly code: Buffer;
	readonly contract: Contract;
	readonly operationId: OperationId<T>;
	toOperation(options?: OperationOptions<T>): RawOperation<T>;
	addToTransaction(tx: Transaction, options?: OperationOptions<T>): Transaction;
	buildTransaction(options?: OperationOptions<T> & OptionsWithEcho): Transaction;
	send(privateKey: PrivateKey, options?: OperationOptions<T> & OptionsWithEcho): unknown;
}

export class CallMethod extends Method<MethodType.CALL> {
	call(options?: OperationOptions<MethodType.CALL> & OptionsWithEcho): Promise<unknown>;
}

export class DeployMethod extends Method<MethodType.CREATE> { }
