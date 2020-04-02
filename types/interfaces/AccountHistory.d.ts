export default interface AccountHistory {
	id: string,
	op: Array<any>,
	result: Array<any>,
	block_num: number,
	trx_in_block: number,
	op_in_block: number,
	virtual_op: number,
	proposal_hist_id: number|undefined,
}
