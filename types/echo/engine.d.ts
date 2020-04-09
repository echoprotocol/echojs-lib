import ChainApi from "../interfaces/ChainApi";
import EchoApi from "./echo-api";
import { HttpProvider, WsProvider } from "./providers";

export default class EchoApiEngine {
	public readonly availableApis: readonly ChainApi[];
	public readonly api: Readonly<{ [apiName in ChainApi]: EchoApi }>;
	public readonly provider: HttpProvider | WsProvider;
	constructor(apis: readonly ChainApi[], provider: HttpProvider | WsProvider);
	public init(): Promise<void>;
}
