import Operation from './operation';

import {
	int64, uint64, uint32, uint16, uint8, string, hex, bool, bytes,
	accountId, assetId, balanceId, contractId, voteId, objectId, proposalId, witnessId,
	array, operation, asset, memoData, optional, object,
	publicPey,
	custom,
} from './types';

const Operations = {};

Operations.transfer = new Operation(
	'transfer',
	{
		fee: asset,
		from: accountId,
		to: accountId,
		amount: asset,
		memo: optional(memoData),
		extensions: optional(object),
	},
);

Operations.limitOrderCreate = new Operation(
	'limit_order_create',
	{
		fee: asset,
		seller: accountId,
		amount_to_sell: asset,
		min_to_receive: asset,
		expiration: uint64, // time_point_sec
		fill_or_kill: bool,
		extensions: optional(object),
	},
);

Operations.limit_order_cancel = new Operation(
	'limit_order_cancel',
	{
		fee: Operations.asset,
		fee_paying_account: accountId,
		order: protocol_id_type('limit_order'),
		extensions: optional(object),
	},
);

Operations.call_order_update = new Operation(
	'call_order_update',
	{
		fee: Operations.asset,
		funding_account: accountId,
		delta_collateral: Operations.asset,
		delta_debt: Operations.asset,
		extensions: optional(object),
	},
);

Operations.fill_order = new Operation(
	'fill_order',
	{
		fee: Operations.asset,
		order_id: objectId,
		account_id: accountId,
		pays: Operations.asset,
		receives: Operations.asset,
	},
);

Operations.authority = new Operation(
	'authority',
	{
		weight_threshold: uint32,
		account_auths: map((accountId), (uint16)),
		key_auths: map((publicPey), (uint16)),
		address_auths: map((address), (uint16)),
	},
);

Operations.account_options = new Operation(
	'account_options',
	{
		memo_key: publicPey,
		voting_account: accountId,
		num_witness: uint16,
		num_committee: uint16,
		votes: set(voteId),
		extensions: optional(object),
	},
);

Operations.account_create = new Operation(
	'account_create',
	{
		fee: Operations.asset,
		registrar: accountId,
		referrer: accountId,
		referrer_percent: uint16,
		name: string,
		owner: Operations.authority,
		active: Operations.authority,
		options: Operations.account_options,
		extensions: optional(object),
	},
);

Operations.account_update = new Operation(
	'account_update',
	{
		fee: Operations.asset,
		account: accountId,
		owner: optional(Operations.authority),
		active: optional(Operations.authority),
		new_options: optional(Operations.account_options),
		extensions: optional(object),
	},
);

Operations.account_whitelist = new Operation(
	'account_whitelist',
	{
		fee: Operations.asset,
		authorizing_account: accountId,
		account_to_list: accountId,
		new_listing: uint8,
		extensions: optional(object),
	},
);

Operations.account_upgrade = new Operation(
	'account_upgrade',
	{
		fee: Operations.asset,
		account_to_upgrade: accountId,
		upgrade_to_lifetime_member: bool,
		extensions: optional(object),
	},
);

Operations.account_transfer = new Operation(
	'account_transfer',
	{
		fee: Operations.asset,
		account_id: accountId,
		new_owner: accountId,
		extensions: optional(object),
	},
);

Operations.price = new Operation(
	'price',
	{
		base: Operations.asset,
		quote: Operations.asset,
	},
);

Operations.asset_options = new Operation(
	'asset_options',
	{
		max_supply: int64,
		market_fee_percent: uint16,
		max_market_fee: int64,
		issuer_permissions: uint16,
		flags: uint16,
		core_exchange_rate: Operations.price,
		whitelist_authorities: set(accountId),
		blacklist_authorities: set(accountId),
		whitelist_markets: set(assetId),
		blacklist_markets: set(assetId),
		description: string,
		extensions: optional(object),
	},
);

Operations.bitasset_options = new Operation(
	'bitasset_options',
	{
		feed_lifetime_sec: uint32,
		minimum_feeds: uint8,
		force_settlement_delay_sec: uint32,
		force_settlement_offset_percent: uint16,
		maximum_force_settlement_volume: uint16,
		short_backing_asset: assetId,
		extensions: optional(object),
	},
);

Operations.asset_create = new Operation(
	'asset_create',
	{
		fee: Operations.asset,
		issuer: accountId,
		symbol: string,
		precision: uint8,
		common_options: Operations.asset_options,
		bitasset_opts: optional(Operations.bitasset_options),
		is_prediction_market: bool,
		extensions: optional(object),
	},
);

Operations.asset_update = new Operation(
	'asset_update',
	{
		fee: Operations.asset,
		issuer: accountId,
		asset_to_update: assetId,
		new_issuer: optional(accountId),
		new_options: Operations.asset_options,
		extensions: optional(object),
	},
);

Operations.asset_update_bitasset = new Operation(
	'asset_update_bitasset',
	{
		fee: Operations.asset,
		issuer: accountId,
		asset_to_update: assetId,
		new_options: Operations.bitasset_options,
		extensions: optional(object),
	},
);

Operations.asset_update_feed_producers = new Operation(
	'asset_update_feed_producers',
	{
		fee: Operations.asset,
		issuer: accountId,
		asset_to_update: assetId,
		new_feed_producers: set(accountId),
		extensions: optional(object),
	},
);

Operations.asset_issue = new Operation(
	'asset_issue',
	{
		fee: Operations.asset,
		issuer: accountId,
		asset_to_issue: Operations.asset,
		issue_to_account: accountId,
		memo: optional(Operations.memo_data),
		extensions: optional(object),
	},
);

Operations.asset_reserve = new Operation(
	'asset_reserve',
	{
		fee: Operations.asset,
		payer: accountId,
		amount_to_reserve: Operations.asset,
		extensions: optional(object),
	},
);

Operations.asset_fund_fee_pool = new Operation(
	'asset_fund_fee_pool',
	{
		fee: Operations.asset,
		from_account: accountId,
		asset_id: assetId,
		amount: int64,
		extensions: optional(object),
	},
);

Operations.asset_settle = new Operation(
	'asset_settle',
	{
		fee: Operations.asset,
		account: accountId,
		amount: Operations.asset,
		extensions: optional(object),
	},
);

Operations.asset_global_settle = new Operation(
	'asset_global_settle',
	{
		fee: Operations.asset,
		issuer: accountId,
		asset_to_settle: assetId,
		settle_price: Operations.price,
		extensions: optional(object),
	},
);

Operations.price_feed = new Operation(
	'price_feed',
	{
		settlement_price: Operations.price,
		maintenance_collateral_ratio: uint16,
		maximum_short_squeeze_ratio: uint16,
		core_exchange_rate: Operations.price,
	},
);

Operations.asset_publish_feed = new Operation(
	'asset_publish_feed',
	{
		fee: Operations.asset,
		publisher: accountId,
		asset_id: assetId,
		feed: Operations.price_feed,
		extensions: optional(object),
	},
);

Operations.witness_create = new Operation(
	'witness_create',
	{
		fee: Operations.asset,
		witness_account: accountId,
		url: string,
		block_signing_key: publicPey,
	},
);

Operations.witness_update = new Operation(
	'witness_update',
	{
		fee: Operations.asset,
		witness: witnessId,
		witness_account: accountId,
		new_url: optional(string),
		new_signing_key: optional(publicPey),
	},
);

Operations.op_wrapper = new Operation(
	'op_wrapper',
	{ op: operation },
);

Operations.proposal_create = new Operation(
	'proposal_create',
	{
		fee: Operations.asset,
		fee_paying_account: accountId,
		expiration_time: uint64, // time_point_sec
		proposed_ops: array(Operations.op_wrapper),
		review_period_seconds: optional(uint32),
		extensions: optional(object),
	},
);

Operations.proposal_update = new Operation(
	'proposal_update',
	{
		fee: Operations.asset,
		fee_paying_account: accountId,
		proposal: proposalId,
		active_approvals_to_add: set(accountId),
		active_approvals_to_remove: set(accountId),
		owner_approvals_to_add: set(accountId),
		owner_approvals_to_remove: set(accountId),
		key_approvals_to_add: set(publicPey),
		key_approvals_to_remove: set(publicPey),
		extensions: optional(object),
	},
);

Operations.proposal_delete = new Operation(
	'proposal_delete',
	{
		fee: Operations.asset,
		fee_paying_account: accountId,
		using_owner_authority: bool,
		proposal: proposalId,
		extensions: optional(object),
	},
);

Operations.withdraw_permission_create = new Operation(
	'withdraw_permission_create',
	{
		fee: Operations.asset,
		withdraw_from_account: accountId,
		authorized_account: accountId,
		withdrawal_limit: Operations.asset,
		withdrawal_period_sec: uint32,
		periods_until_expiration: uint32,
		period_start_time: uint64, // time_point_sec
	},
);

Operations.withdraw_permission_update = new Operation(
	'withdraw_permission_update',
	{
		fee: Operations.asset,
		withdraw_from_account: accountId,
		authorized_account: accountId,
		permission_to_update: protocol_id_type('withdraw_permission'),
		withdrawal_limit: Operations.asset,
		withdrawal_period_sec: uint32,
		period_start_time: uint64, // time_point_sec
		periods_until_expiration: uint32,
	},
);

Operations.withdraw_permission_claim = new Operation(
	'withdraw_permission_claim',
	{
		fee: Operations.asset,
		withdraw_permission: protocol_id_type('withdraw_permission'),
		withdraw_from_account: accountId,
		withdraw_to_account: accountId,
		amount_to_withdraw: Operations.asset,
		memo: optional(Operations.memo_data),
	},
);

Operations.withdraw_permission_delete = new Operation(
	'withdraw_permission_delete',
	{
		fee: Operations.asset,
		withdraw_from_account: accountId,
		authorized_account: accountId,
		withdrawal_permission: protocol_id_type('withdraw_permission'),
	},
);

Operations.committee_member_create = new Operation(
	'committee_member_create',
	{
		fee: Operations.asset,
		committee_member_account: accountId,
		url: string,
	},
);

Operations.committee_member_update = new Operation(
	'committee_member_update',
	{
		fee: Operations.asset,
		committee_member: protocol_id_type('committee_member'),
		committee_member_account: accountId,
		new_url: optional(string),
	},
);

Operations.chain_parameters = new Operation(
	'chain_parameters',
	{
		current_fees: Operations.fee_schedule,
		block_interval: uint8,
		maintenance_interval: uint32,
		maintenance_skip_slots: uint8,
		committee_proposal_review_period: uint32,
		maximum_transaction_size: uint32,
		maximum_block_size: uint32,
		maximum_time_until_expiration: uint32,
		maximum_proposal_lifetime: uint32,
		maximum_asset_whitelist_authorities: uint8,
		maximum_asset_feed_publishers: uint8,
		maximum_witness_count: uint16,
		maximum_committee_count: uint16,
		maximum_authority_membership: uint16,
		reserve_percent_of_fee: uint16,
		network_percent_of_fee: uint16,
		lifetime_referrer_percent_of_fee: uint16,
		cashback_vesting_period_seconds: uint32,
		cashback_vesting_threshold: int64,
		count_non_member_votes: bool,
		allow_non_member_whitelists: bool,
		witness_pay_per_block: int64,
		worker_budget_per_day: int64,
		max_predicate_opcode: uint16,
		fee_liquidation_threshold: int64,
		accounts_per_fee_scale: uint16,
		account_fee_scale_bitshifts: uint8,
		max_authority_depth: uint8,
		extensions: optional(object),
	},
);

Operations.committee_member_update_global_parameters = new Operation(
	'committee_member_update_global_parameters',
	{
		fee: Operations.asset,
		new_parameters: Operations.chain_parameters,
	},
);

Operations.linear_vesting_policy_initializer = new Operation(
	'linear_vesting_policy_initializer',
	{
		begin_timestamp: uint64, // time_point_sec
		vesting_cliff_seconds: uint32,
		vesting_duration_seconds: uint32,
	},
);

Operations.cdd_vesting_policy_initializer = new Operation(
	'cdd_vesting_policy_initializer',
	{
		start_claim: uint64, // time_point_sec
		vesting_seconds: uint32,
	},
);

const vestingPolicyInitializer = static_variant([
	Operations.linear_vesting_policy_initializer,
	Operations.cdd_vesting_policy_initializer,
]);

Operations.vestingBalanceCreate = new Operation(
	'vesting_balance_create',
	{
		fee: Operations.asset,
		creator: accountId,
		owner: accountId,
		amount: Operations.asset,
		policy: vesting_policy_initializer,
	},
);

Operations.vesting_balance_withdraw = new Operation(
	'vesting_balance_withdraw',
	{
		fee: Operations.asset,
		vesting_balance: protocol_id_type('vesting_balance'),
		owner: accountId,
		amount: Operations.asset,
	},
);

Operations.refund_worker_initializer = new Operation('refund_worker_initializer');

Operations.vesting_balance_worker_initializer = new Operation(
	'vesting_balance_worker_initializer',
	{ pay_vesting_period_days: uint16 },
);

Operations.burn_worker_initializer = new Operation('burn_worker_initializer');

const worker_initializer = static_variant([
	Operations.refund_worker_initializer,
	Operations.vesting_balance_worker_initializer,
	Operations.burn_worker_initializer,
]);

Operations.worker_create = new Operation(
	'worker_create',
	{
		fee: Operations.asset,
		owner: accountId,
		work_begin_date: uint64, // time_point_sec
		work_end_date: uint64, // time_point_sec
		daily_pay: int64,
		name: string,
		url: string,
		initializer: worker_initializer,
	},
);

Operations.custom = new Operation(
	'custom',
	{
		fee: Operations.asset,
		payer: accountId,
		required_auths: set(accountId),
		id: uint16,
		data: bytes(),
	},
);

Operations.account_name_eq_lit_predicate = new Operation(
	'account_name_eq_lit_predicate',
	{
		account_id: accountId,
		name: string,
	},
);

Operations.asset_symbol_eq_lit_predicate = new Operation(
	'asset_symbol_eq_lit_predicate',
	{
		asset_id: assetId,
		symbol: string,
	},
);

Operations.block_id_predicate = new Operation(
	'block_id_predicate',
	{ id: bytes(20) },
);

const predicate = static_variant([
	Operations.account_name_eq_lit_predicate,
	Operations.asset_symbol_eq_lit_predicate,
	Operations.block_id_predicate,
]);

Operations.assert = new Operation(
	'assert',
	{
		fee: Operations.asset,
		fee_paying_account: accountId,
		predicates: array(predicate),
		required_auths: set(accountId),
		extensions: optional(object),
	},
);

Operations.balance_claim = new Operation(
	'balance_claim',
	{
		fee: Operations.asset,
		deposit_to_account: accountId,
		balance_to_claim: protocol_id_type('balance'),
		balance_owner_key: publicPey,
		total_claimed: Operations.asset,
	},
);

Operations.override_transfer = new Operation(
	'override_transfer',
	{
		fee: Operations.asset,
		issuer: accountId,
		from: accountId,
		to: accountId,
		amount: Operations.asset,
		memo: optional(Operations.memo_data),
		extensions: optional(object),
	},
);

Operations.stealth_confirmation = new Operation(
	'stealth_confirmation',
	{
		one_time_key: publicPey,
		to: optional(publicPey),
		encrypted_memo: bytes(),
	},
);

Operations.blind_output = new Operation(
	'blind_output',
	{
		commitment: bytes(33),
		range_proof: bytes(),
		owner: Operations.authority,
		stealth_memo: optional(Operations.stealth_confirmation),
	},
);

Operations.transfer_to_blind = new Operation(
	'transfer_to_blind',
	{
		fee: Operations.asset,
		amount: Operations.asset,
		from: accountId,
		blinding_factor: bytes(32),
		outputs: array(Operations.blind_output),
	},
);

Operations.blind_input = new Operation(
	'blind_input',
	{
		commitment: bytes(33),
		owner: Operations.authority,
	},
);

Operations.blind_transfer = new Operation(
	'blind_transfer',
	{
		fee: Operations.asset,
		inputs: array(Operations.blind_input),
		outputs: array(Operations.blind_output),
	},
);

Operations.transfer_from_blind = new Operation(
	'transfer_from_blind',
	{
		fee: Operations.asset,
		amount: Operations.asset,
		to: accountId,
		blinding_factor: bytes(32),
		inputs: array(Operations.blind_input),
	},
);

Operations.asset_settle_cancel = new Operation(
	'asset_settle_cancel',
	{
		fee: Operations.asset,
		settlement: protocol_id_type('force_settlement'),
		account: accountId,
		amount: Operations.asset,
		extensions: optional(object),
	},
);

Operations.asset_claim_fees = new Operation(
	'asset_claim_fees',
	{
		fee: Operations.asset,
		issuer: accountId,
		amount_to_claim: Operations.asset,
		extensions: optional(object),
	},
);

Operations.contract = new Operation(
	'contract',
	{
		fee: Operations.asset,
		registrar: accountId,
		receiver: optional(contractId),
		asset_id: assetId,
		value: uint64,
		gasPrice: uint64,
		gas: uint64,
		code: string,
	},
);

Operations.contract_transfer = new Operation(
	'contract_transfer',
	{
		fee: Operations.asset,
		from: contractId,
		to: contractId,
		amount: Operations.asset,
		extensions: optional(object),
	},
);

