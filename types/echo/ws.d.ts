import { EventEmitter } from "events";
import ChainApi from "../interfaces/ChainApi";

export interface Options {
	connectionTimeout: number;
	maxRetries: number;
	pingTimeout: number;
	pingDelay: number;
	debug: boolean;
	apis: ChainApi[];
}

export interface TempOptions {
	onOpen?: () => any;
	onClose?: (code: number, reason: string) => any;
	onError?: (error: any) => any;
}

export interface EchoApi { exec(method: string, params: any[]): Promise<any>; }

export default class EchoWS extends EventEmitter {
	readonly url: string;
	readonly echoApis: Readonly<{ [chainApi in ChainApi]: EchoApi }>;
	readonly options: Readonly<Options>;

	readonly chainApiById: Readonly<{ [key: number]: ChainApi }>;
	readonly lastUsedId: number;
	readonly isConnected: boolean;
	readonly apis: readonly ChainApi[];
	readonly connectRetryNumber: number;

	dbApi(): EchoApi;
	networkApi(): EchoApi;
	historyApi(): EchoApi;
	registrationApi(): EchoApi;
	assetApi(): EchoApi;
	loginApi(): EchoApi;
	networkNodeApi(): EchoApi;

	connect(url: string, options?: Partial<Options> & TempOptions): Promise<void>;
	call(props: [number, string, ...any[]], timeout?: number): Promise<any>;
	close(): Promise<void>;
	setDebugOption(debug: boolean): void;
	login(user: string, password: string, timeout?: number): Promise<unknown>;
	ping(): Promise<void>;
	reconnect(): Promise<void>;
}
