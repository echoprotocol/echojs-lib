export default interface ContractHistory {
	block_num: number,
	id: string,
	op: Array<any>,
	op_in_trx: number,
	result: [0, {}],
	trx_in_block: number,
	virtual_op: number,
	proposal_hist_id: number|undefined;
}
