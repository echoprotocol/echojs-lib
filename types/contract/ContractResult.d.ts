import { BroadcastingResult } from "../echo/transaction";
import ApiContractResult from "../interfaces/ContractResult";

export default class ContractResult<T, TEvents> {
	readonly transactionResult: BroadcastingResult;
	readonly contractResult: ApiContractResult;
	readonly decodedResult: T;
	readonly events: TEvents;
}
