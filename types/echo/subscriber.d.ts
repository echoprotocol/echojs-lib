import { Log } from "../interfaces/vm/types";
import { ContractLogsFilterOptions } from "./api";

export default class Subscriber {
	setBlockApplySubscribe(cb: (blockHash: unknown) => any): Promise<void>;
	setContractLogsSubscribe(cb: (result: Log[]) => any, options?: ContractLogsFilterOptions): Promise<number|string>;
}
