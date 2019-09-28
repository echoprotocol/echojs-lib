import Transaction from "../echo/transaction";
import ContractTransactionResult from "./ContractTransactionResult";
import OperationId from "../interfaces/OperationId";
import { TOperationInput } from "../serializers/operation";

export default class ContractTransaction extends Transaction<ContractTransactionResult> {
	addOperation<T extends OperationId>(
		operationId: T,
		operationProps: TOperationInput<T, true>[1],
	): ContractTransaction;
}
