import BigNumber from "bignumber.js";
import PrivateKey from "../crypto/private-key";
import Echo from "../echo";
import { Abi } from "../interfaces/Abi";
import ContractResult from "./ContractResult";

export default class Contract<TDeployArgs = Array<any>> {

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
