import { BroadcastingResult } from "../echo/transaction";
import { ContractResult } from "../interfaces/ContractResult";

export default class ContractTransactionResult {
	readonly raw: readonly BroadcastingResult[];
	

	readonly transactionResult: readonly BroadcastingResult[];
	readonly contractResult: ContractResult;
	readonly decodedResult: any;
	readonly events: Readonly<{ [eventName: string]: { [field: string]: string } }>;
}
