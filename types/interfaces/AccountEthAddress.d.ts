export default interface AccountEthAddress {
	id: string,
	account: string,
	eth_addr: string,
	transaction_hash: string,
	extensions: Array<unknown>,
}
