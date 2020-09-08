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
