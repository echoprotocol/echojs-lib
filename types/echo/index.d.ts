import Api from "./api";
import Transaction from "./transaction";
import { CacheOptions } from "./cache";
import Subscriber from "./subscriber";
import ChainApi from "../interfaces/ChainApi";

export interface EchoOptions {
	cache?: CacheOptions;
	apis?: ChainApi[];
	debug?: boolean;
}

export default class Echo {
	public readonly isConnected: boolean;
	public readonly subscriber: Subscriber;
	public readonly apis: ReadonlySet<string>;
	api: Api;
	connect(address: string, options?: EchoOptions): Promise<void>;
	createTransaction(): Transaction;
}
