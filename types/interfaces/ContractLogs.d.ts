export default interface ContractLogs {
	address: string,
	log: Array<string>,
	data: string,
	trx_num: string,
	op_num: number,
}
