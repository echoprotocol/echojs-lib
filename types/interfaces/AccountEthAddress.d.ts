export default interface AccountEthAddress {
	id: string,
	account: string,
	eth_addr: string,
	transaction_hash: string,
	is_approved: boolean,
	approves: Array<string>,
	extensions: Array<unknown>,
}
