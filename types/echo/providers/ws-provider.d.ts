import BaseProvider, { BaseProviderOptions } from "./base-provider";
import ConnectionType from "./connection-type";

export interface WsProviderOptions extends BaseProviderOptions {
	connectionTimeout?: number;
	maxRetries?: number;
	pingDelay?: number;
	pingTimeout?: number;
}

export default class WsProvider extends BaseProvider {
	public readonly connectionType: ConnectionType.WS;
	public connectionTimeout: number;
	public maxRetries: number;
	public pingDelay: number;
	public pingTimeout: number;
	constructor(url: string, options?: WsProviderOptions);
	public call(apiId: number, method: string, params: any[]): Promise<unknown>;
	public close(): Promise<void>;
	public connect(): Promise<void>;
	public reconnect(): Promise<void>;
}
