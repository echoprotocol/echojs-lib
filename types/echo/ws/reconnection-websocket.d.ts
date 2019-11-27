import ChainApi from "../../interfaces/ChainApi";
import EchoApi from "./echo-api";

export default class ReconnectionWebsocket {
	readonly url: string;
	readonly errorHandlers: Array<(error: any) => any>;
	readonly isConnected: boolean;
	readonly apis: { [apiName in ChainApi]?: EchoApi };
	connect(url: string, apis: ChainApi[]): Promise<void>;
	close(): Promise<void>;
	reconnect(): Promise<void>;
	call(apiId: number, method: string, ...params: any[]): Promise<any>;
}
