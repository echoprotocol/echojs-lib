import BigNumber from 'bignumber.js';
import { Echo } from '../index';
import  PrivateKey  from '../crypto/private-key';
import  Transaction  from '../echo/transaction';
import ApiContractResult from '../interfaces/ContractResult';
import { BroadcastingResult } from '../echo/transaction';
import { Abi } from '../interfaces/Abi';
import Contract from "./Contract";

declare class ContractResult<T, TEvents> {
	readonly transactionResult: BroadcastingResult;
	readonly contractResult: ApiContractResult;
	readonly decodedResult: T;
	readonly events: TEvents;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type ContractTransaction<T, TEvents> = Omit<Transaction, 'broadcast'> & {
	broadcast(wasBroadcastedCallback?: () => any): Promise<ContractResult<T, TEvents>>;
};

declare class Method<T = any, TEvents = { [eventName: string]: { [field: string]: any } }> {
	readonly code: string;
	constructor(contract: Contract, abiMethodotputs: Abi, code: string);

	call(options?: {
		contractId?: string,
		assetId?: string,
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

declare function generateInterface(contractName: string, abi: Abi, indent?: string): string;

export default Contract;
export { default as BigNumber } from "bignumber.js";
export { default as echo } from "../index";
export { default as encode } from "./encode";
export { default as decode } from "./decode";
export { Abi, Method, generateInterface };
