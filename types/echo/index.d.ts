import Api from "./api";
import Transaction from "./transaction";

export default class Echo {
	get api(): Api;
	connect(address: string): Promise<Echo>;
	createTransaction(): Transaction;
}
