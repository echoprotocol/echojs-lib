import Api from "./api";
import Transaction from "./transaction";

export default class Echo {
	api: Api;
	connect(address: string): Promise<void>;
	createTransaction(): Transaction;
}
