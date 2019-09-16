import BigNumber from 'bignumber.js';
import { PrivateKey, Echo, Transaction } from 'echojs-lib';
import * as EchoJSLib from 'echojs-lib';
import { ContractResult as ApiContractResult } from 'echojs-lib/types/echo/api';
import { BroadcastingResult } from 'echojs-lib/types/echo/transaction';
import { Abi } from './_Abi';

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

declare class Contract<TDeployArgs = Array<any>> {

	__TDeployArgs__: TDeployArgs;

	static deploy(
		code: Buffer | string,
		echo: Echo,
		privateKey: PrivateKey,
		options?: {
			ethAccuracy?: boolean,
			supportedAssetId?: string,
			value?: { amount?: number | string | BigNumber, asset_id?: string },
		},
	): Promise<string>;

	static deploy<T = Array<any>>(
		code: Buffer | string,
		echo: Echo,
		privateKey: PrivateKey,
		options: {
			abi: Abi,
			ethAccuracy?: boolean,
			supportedAssetId?: string,
			value?: { amount?: number | string | BigNumber, asset_id?: string },
			args?: any,
		},
	): Promise<Contract>;

	readonly namesDublications: Set<string>;
	readonly methods: { [nameOrHashOrSignature: string]: (...args: Array<any>) => Method };
	constructor(abi: Abi, options?: { echo?: Echo, contractId?: string });
	abi: Abi;
	echo: Echo;
	address?: string;
	deploy(code: Buffer | string, privateKey: PrivateKey, options?: {
		ethAccuracy?: boolean,
		supportedAssetId?: string,
		value?: { amount?: number | string | BigNumber, asset_id?: string },
		args?: TDeployArgs,
	}): Promise<Contract<TDeployArgs>>;
	parseLogs(logs: Array<{ address?: string, log: [string], data: string }>): {
		[event: string]: { [field: string]: any },
	};
	fallback(
		privateKey: PrivateKey,
		value: number | string | BigNumber,
		assetId?: string,
	): Promise<ContractResult<null, any>>;
}

declare function generateInterface(contractName: string, abi: Abi, indent?: string): string;

export default Contract;
export { default as BigNumber } from "bignumber.js";
export { PrivateKey, default as echo, Echo } from "echojs-lib";
export { default as encode } from "./encode";
export { default as decode } from "./decode";
export { Abi, Method, generateInterface, EchoJSLib };
