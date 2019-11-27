import ReconnectionWebsocket from "./reconnection-websocket";

export default class EchoApi {
	readonly wsRpc: ReconnectionWebsocket;
	readonly apiId?: number;
	constructor(wsRpc: ReconnectionWebsocket, apiId?: number);
	exec(method: string, params: any[]): Promise<any>;
}
