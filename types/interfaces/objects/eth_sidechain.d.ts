export interface ERC20DepositTokenObject {
	id: string;
	account: string;
	erc20_addr: string;
	value: string;
	transaction_hash: string;
	is_approved: boolean;
	is_sent: boolean;
	echo_block_number: number;
	approves: string[];
	extensions: unknown[];
}

export interface ERC20WithdrawTokenObject {
	id: string;
	withdraw_id: number | string;
	account: string;
	to: string;
	erc20_token: string;
	value: string;
	is_approved: boolean;
	is_sent: boolean;
	echo_block_number: number;
	transaction_hash?: string;
	approves: string[];
	extensions: unknown[];
}
