export default interface AccountEthAddress {
	id: string,
	account: string,
	eth_addr: string,
	is_approved: boolean,
	approves: Array<any>,
	extensions: Array<any>,
}
