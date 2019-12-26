import TransactionObject from './TransactionObject';

export default interface Block {
	previous: string,
	timestamp: string,
	account: string,
	transaction_merkle_root: string,
	state_root_hash: string,
	result_root_hash:string ,
	extensions: never[],
	ed_signature: string,
	round: number,
	rand: string,
	cert: object,
	transactions: TransactionObject[],
}
