import Transaction from "../echo/transaction";
import ContractResult from "./ContractResult";

type ContractTransaction<T, TEvents> = Omit<Transaction, 'broadcast'> & {
	broadcast(wasBroadcastedCallback?: () => any): Promise<ContractResult<T, TEvents>>;
};

export default ContractTransaction;
