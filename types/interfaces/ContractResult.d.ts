export default ContractResult;

type ContractResult = [number, {
	exec_res: {
		excepted: 'None' | unknown,
		new_address: string,
		output: string,
		code_deposit: 'Success' | unknown,
		gas_for_deposit: number,
		deposit_size: number,
	},
	tr_receipt: {
		status_code: number,
		gas_used: number,
		bloom: string,
		log: unknown[],
	},
}];
