type GetFullAccountInfoResult = Array<{
	blacklisting_accounts: Array<string>,
	proposals: Set<any>, // FIXME: type
	statistics: {
		lifetime_fees_paid: number,
		most_recent_op: string,
		removed_ops: number,
		owner: string,
		pending_vested_fees: number,
		pending_fees: number,
		total_ops: number,
		total_core_in_orders: number,
		id: string,
	},
	assets: Array<string>,
	vesting_balances: Array<any>, // FIXME: type
	active_special_authority: [number, { [key: string]: any }], // FIXME: type
	network_fee_percentage: number,
	active: {
		weight_threshold: number,
		account_auths: Array<any>, // FIXME: type
		key_auths: Array<[string, number]>,
		address_auths: Array<any>, // FIXME: type
	},
	call_orders: Set<any>, // FIXME: type
	blacklisted_accounts: Array<any>, // FIXME: type
	withdraws: Array<any>, // FIXME: type
	votes: Array<any>, // FIXME: type
	limit_orders: Set<any>, // FIXME: type
	top_n_control_flags: number,
	whitelisting_accounts: Array<any>, // FIXME: type
	name: string,
	referrer_name: string,
	registrar: string,
	owner_special_authority: [number, { [key: string]: any }], // FIXME: type
	owner: {
		weight_threshold: number,
		account_auths: Array<any>, // FIXME: type
		key_auths: Array<[string, number]>,
		address_auths: Array<any>, // FIXME: type
	},
	history: Array<{
		id: string,
		op: OPERATION<any>,
		result: OPERATION_RESULT<OPERATION_RESULT_VARIANT>,
		block_num: number,
		trx_in_block: number,
		op_in_trx: number,
		virtual_op: number,
	}>,
	lifetime_referrer_name: string,
	membership_expiration_date: string,
	referrer_rewards_percentage: number,
	lifetime_referrer: string,
	balances: { [assetId: string]: BalanceObjectId },
	settle_orders: Array<any>, // FIXME: type
	id: string,
	lifetime_referrer_fee_percentage: number,
	registrar_name: string,
	options: {
		memo_key: string,
		voting_account: string,
		delegating_account: string,
		num_witness: number,
		num_committee: number,
		votes: Array<any>, // FIXME: type
		extensions: Array<any>, // FIXME: type
	},
	referrer: string,
	whitelisted_accounts: Array<any>, // FIXME: type
	ed_key: string,
}>;

export default GetFullAccountInfoResult;
