import Api from "./api";
import Transaction from "./transaction";
import { CacheOptions } from "./cache";
import Subscriber from "./subscriber";
import { CACHE_MAPS } from "../constants";

export interface EchoOptions {
	cache?: CacheOptions;
	apis?: CACHE_MAPS[];
}

export default class Echo {
	public readonly subscriber: Subscriber;
	public readonly apis: ReadonlySet<string>;
	api: Api;
	connect(address: string, options?: EchoOptions): Promise<void>;
	createTransaction(): Transaction;
}
