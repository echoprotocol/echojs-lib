export default interface BlockHeader {
	previous: string,
	timestamp: string,
	account: string,
	transaction_merkle_root: string,
	state_root_hash: string,
	result_root_hash: string,
	extensions: Array<any>
}
