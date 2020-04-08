import { HttpProvider, WsProvider } from "./providers";

export default class EchoApi {
	public readonly apiName: string;
	public readonly provider: HttpProvider | WsProvider;
	constructor(provider: HttpProvider | WsProvider, apiName: string);
	init(): Promise<EchoApi>;
	exec(method: string, params: any[]): Promise<unknown>;
}
