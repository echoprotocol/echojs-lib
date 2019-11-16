import BigNumber from "bignumber.js";

import PrivateKey from "../crypto/private-key";
import Echo from "../echo";
import { Abi } from "../interfaces/Abi";
import Contract from "./Contract";
import ContractResult from "./ContractResult";
import ContractTransaction from "./ContractTransaction";

declare class Method<T = any, TEvents = { [eventName: string]: { [field: string]: any } }> {
	readonly code: string;
	constructor(contract: Contract, abiMethodotputs: Abi, code: string);

	call(options?: {
		contractId?: string,
		asset?: { asset_id: string, amount: number | string | BigNumber },
		accountId?: string,
		echo?: Echo,
	}): Promise<T>;

	buildTransaction(options?: {
		contractId?: string,
		registrar?: string,
		privateKey?: PrivateKey,
		value?: { amount?: number | string | BigNumber, asset_id?: string },
	}): ContractTransaction<T, TEvents>;

	buildTransaction(options?: {
		contractId?: string,
		privateKey: PrivateKey,
		value?: { amount?: number | string | BigNumber, asset_id?: string },
	}): Promise<ContractTransaction<T, TEvents>>;

	broadcast(options?: {
		contractId?: string,
		registrar?: string,
		privateKey: PrivateKey,
		value?: { amount?: number | string | BigNumber, asset_id?: string },
	}): Promise<ContractResult<T, TEvents>>;

}
