/* eslint-disable camelcase */

const types = require('./types');
const SerializerImpl = require('./serializer');

const {
	//	idType,
	//	varint32,
	uint8, uint16, uint32, int64, uint64,
	string, bytes, bool, array, protocol_id_type, object_id_type, vote_id,
	static_variant, map, set,
	public_key,
	time_point_sec,
	optional,
} = types;

const futureExtensions = types.void;

/*
 When updating generated code
 Replace:  operation = static_variant [
 with:	 operation.st_operations = [

 Delete:
 public_key = new Serializer(
 'public_key'
 key_data: bytes 33
 )

 */
// Place-holder, their are dependencies on 'operation' .. The final list of
// operations is not avialble until the very end of the generated code.
// See: operation.st_operations = ...
const operation = static_variant();
// module.exports['operation'] = operation;

// For module.exports
const Serializer = SerializerImpl;
const feeParameters = {};
// Custom-types follow Generated code:

// ##  Generated code follows
// # programs/js_operation_serializer > npm i -g decaffeinate
// ## -------------------------------
feeParameters.transfer_operation_fee_parameters = new Serializer(
	'transfer_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.limit_order_create_operation_fee_parameters = new Serializer(
	'limit_order_create_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.limit_order_cancel_operation_fee_parameters = new Serializer(
	'limit_order_cancel_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.call_order_update_operation_fee_parameters = new Serializer(
	'call_order_update_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.fill_order_operation_fee_parameters = new Serializer('fill_order_operation_fee_parameters');

feeParameters.account_create_operation_fee_parameters = new Serializer(
	'account_create_operation_fee_parameters',
	{
		basic_fee: uint64,
		premium_fee: uint64,
		price_per_kbyte: uint32,
	},
);

feeParameters.account_update_operation_fee_parameters = new Serializer(
	'account_update_operation_fee_parameters',
	{
		fee: int64,
		price_per_kbyte: uint32,
	},
);

feeParameters.account_whitelist_operation_fee_parameters = new Serializer(
	'account_whitelist_operation_fee_parameters',
	{ fee: int64 },
);

feeParameters.account_upgrade_operation_fee_parameters = new Serializer(
	'account_upgrade_operation_fee_parameters',
	{
		membership_annual_fee: uint64,
		membership_lifetime_fee: uint64,
	},
);

feeParameters.account_transfer_operation_fee_parameters = new Serializer(
	'account_transfer_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.asset_create_operation_fee_parameters = new Serializer(
	'asset_create_operation_fee_parameters',
	{
		symbol3: uint64,
		symbol4: uint64,
		long_symbol: uint64,
		price_per_kbyte: uint32,
	},
);

feeParameters.asset_update_operation_fee_parameters = new Serializer(
	'asset_update_operation_fee_parameters',
	{
		fee: uint64,
		price_per_kbyte: uint32,
	},
);

feeParameters.asset_update_bitasset_operation_fee_parameters = new Serializer(
	'asset_update_bitasset_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.asset_update_feed_producers_operation_fee_parameters = new Serializer(
	'asset_update_feed_producers_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.asset_issue_operation_fee_parameters = new Serializer(
	'asset_issue_operation_fee_parameters',
	{
		fee: uint64,
		price_per_kbyte: uint32,
	},
);

feeParameters.asset_reserve_operation_fee_parameters = new Serializer(
	'asset_reserve_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.asset_fund_fee_pool_operation_fee_parameters = new Serializer(
	'asset_fund_fee_pool_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.asset_settle_operation_fee_parameters = new Serializer(
	'asset_settle_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.asset_global_settle_operation_fee_parameters = new Serializer(
	'asset_global_settle_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.asset_publish_feed_operation_fee_parameters = new Serializer(
	'asset_publish_feed_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.proposal_create_operation_fee_parameters = new Serializer(
	'proposal_create_operation_fee_parameters',
	{
		fee: uint64,
		price_per_kbyte: uint32,
	},
);

feeParameters.proposal_update_operation_fee_parameters = new Serializer(
	'proposal_update_operation_fee_parameters',
	{
		fee: uint64,
		price_per_kbyte: uint32,
	},
);

feeParameters.proposal_delete_operation_fee_parameters = new Serializer(
	'proposal_delete_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.withdraw_permission_create_operation_fee_parameters = new Serializer(
	'withdraw_permission_create_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.withdraw_permission_update_operation_fee_parameters = new Serializer(
	'withdraw_permission_update_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.withdraw_permission_claim_operation_fee_parameters = new Serializer(
	'withdraw_permission_claim_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.withdraw_permission_delete_operation_fee_parameters = new Serializer(
	'withdraw_permission_delete_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.committee_member_create_operation_fee_parameters = new Serializer(
	'committee_member_create_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.committee_member_update_operation_fee_parameters = new Serializer(
	'committee_member_update_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.committee_member_update_global_parameters_operation_fee_parameters = new Serializer(
	'committee_member_update_global_parameters_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.vesting_balance_create_operation_fee_parameters = new Serializer(
	'vesting_balance_create_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.vesting_balance_withdraw_operation_fee_parameters = new Serializer(
	'vesting_balance_withdraw_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.custom_operation_fee_parameters = new Serializer(
	'custom_operation_fee_parameters',
	{
		fee: uint64,
		price_per_kbyte: uint32,
	},
);

feeParameters.assert_operation_fee_parameters = new Serializer(
	'assert_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.balance_claim_operation_fee_parameters = new Serializer('balance_claim_operation_fee_parameters');

feeParameters.override_transfer_operation_fee_parameters = new Serializer(
	'override_transfer_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.asset_settle_cancel_operation_fee_parameters = new Serializer('asset_settle_cancel_operation_fee_parameters');

feeParameters.asset_claim_fees_operation_fee_parameters = new Serializer(
	'asset_claim_fees_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.bid_collateral_operation_fee_parameters = new Serializer(
	'bid_collateral_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.execute_bid_operation_fee_parameters = new Serializer('execute_bid_operation_fee_parameters');

feeParameters.create_contract_operation_fee_parameters = new Serializer(
	'create_contract_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.call_contract_operation_fee_parameters = new Serializer(
	'call_contract_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.contract_transfer_operation_fee_parameters = new Serializer(
	'contract_transfer_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.change_sidechain_config_operation_fee_parameters = new Serializer(
	'change_sidechain_config_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.account_address_create_operation_fee_parameters = new Serializer(
	'account_address_create_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.transfer_to_address_operation_fee_parameters = new Serializer(
	'transfer_to_address_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.generate_eth_address_operation_fee_parameters = new Serializer(
	'generate_eth_address_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.create_eth_address_operation_fee_parameters = new Serializer(
	'generate_eth_address_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.deposit_eth_operation_fee_parameters = new Serializer(
	'deposit_eth_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.withdraw_eth_operation_fee_parameters = new Serializer(
	'withdraw_eth_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.approve_withdraw_eth_operation_fee_parameters = new Serializer(
	'approve_withdraw_eth_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.contract_fund_pool_operation_fee_parameters = new Serializer(
	'contract_fund_pool_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.contract_whitelist_operation_fee_parameters = new Serializer(
	'contract_whitelist_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.sidechain_issue_operation_fee_parameters = new Serializer(
	'sidechain_issue_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.sidechain_burn_operation_fee_parameters = new Serializer(
	'sidechain_burn_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.register_erc20_token_operation_fee_parameters = new Serializer(
	'register_erc20_token_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.deposit_erc20_token_operation_fee_parameters = new Serializer(
	'deposit_erc20_token_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.withdraw_erc20_token_operation_fee_parameters = new Serializer(
	'withdraw_erc20_token_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.approve_erc20_token_withdraw_operation_fee_parameters = new Serializer(
	'approve_erc20_token_withdraw_operation_fee_parameters',
	{ fee: uint64 },
);

feeParameters.contract_update_operation_fee_parameters = new Serializer(
	'contract_update_operation_fee_parameters',
	{ fee: uint64 },
);

const fee_parameters = static_variant([
	feeParameters.transfer_operation_fee_parameters,
	feeParameters.limit_order_create_operation_fee_parameters,
	feeParameters.limit_order_cancel_operation_fee_parameters,
	feeParameters.call_order_update_operation_fee_parameters,
	feeParameters.fill_order_operation_fee_parameters,
	feeParameters.account_create_operation_fee_parameters,
	feeParameters.account_update_operation_fee_parameters,
	feeParameters.account_whitelist_operation_fee_parameters,
	feeParameters.account_upgrade_operation_fee_parameters,
	feeParameters.account_transfer_operation_fee_parameters,
	feeParameters.asset_create_operation_fee_parameters,
	feeParameters.asset_update_operation_fee_parameters,
	feeParameters.asset_update_bitasset_operation_fee_parameters,
	feeParameters.asset_update_feed_producers_operation_fee_parameters,
	feeParameters.asset_issue_operation_fee_parameters,
	feeParameters.asset_reserve_operation_fee_parameters,
	feeParameters.asset_fund_fee_pool_operation_fee_parameters,
	feeParameters.asset_settle_operation_fee_parameters,
	feeParameters.asset_global_settle_operation_fee_parameters,
	feeParameters.asset_publish_feed_operation_fee_parameters,
	feeParameters.proposal_create_operation_fee_parameters,
	feeParameters.proposal_update_operation_fee_parameters,
	feeParameters.proposal_delete_operation_fee_parameters,
	feeParameters.withdraw_permission_create_operation_fee_parameters,
	feeParameters.withdraw_permission_update_operation_fee_parameters,
	feeParameters.withdraw_permission_claim_operation_fee_parameters,
	feeParameters.withdraw_permission_delete_operation_fee_parameters,
	feeParameters.committee_member_create_operation_fee_parameters,
	feeParameters.committee_member_update_operation_fee_parameters,
	feeParameters.committee_member_update_global_parameters_operation_fee_parameters,
	feeParameters.vesting_balance_create_operation_fee_parameters,
	feeParameters.vesting_balance_withdraw_operation_fee_parameters,
	feeParameters.custom_operation_fee_parameters,
	feeParameters.assert_operation_fee_parameters,
	feeParameters.balance_claim_operation_fee_parameters,
	feeParameters.override_transfer_operation_fee_parameters,
	feeParameters.asset_settle_cancel_operation_fee_parameters,
	feeParameters.asset_claim_fees_operation_fee_parameters,
	feeParameters.bid_collateral_operation_fee_parameters,
	feeParameters.execute_bid_operation_fee_parameters,
	feeParameters.create_contract_operation_fee_parameters,
	feeParameters.call_contract_operation_fee_parameters,
	feeParameters.contract_transfer_operation_fee_parameters,
	feeParameters.change_sidechain_config_operation_fee_parameters,
	feeParameters.account_address_create_operation_fee_parameters,
	feeParameters.transfer_to_address_operation_fee_parameters,
	feeParameters.generate_eth_address_operation_fee_parameters,
	feeParameters.generate_eth_address_operation_fee_parameters,
	feeParameters.create_eth_address_operation_fee_parameters,
	feeParameters.withdraw_eth_operation_fee_parameters,
	feeParameters.approve_withdraw_eth_operation_fee_parameters,
	feeParameters.contract_fund_pool_operation_fee_parameters,
	feeParameters.contract_whitelist_operation_fee_parameters,
	feeParameters.sidechain_issue_operation_fee_parameters,
	feeParameters.sidechain_burn_operation_fee_parameters,
	feeParameters.register_erc20_token_operation_fee_parameters,
	feeParameters.withdraw_erc20_token_operation_fee_parameters,
	feeParameters.deposit_erc20_token_operation_fee_parameters,
	feeParameters.approve_erc20_token_withdraw_operation_fee_parameters,
	feeParameters.contract_update_operation_fee_parameters,
]);

const Operations = {};

Operations.fee_schedule = new Serializer(
	'fee_schedule',
	{
		parameters: set(fee_parameters),
		scale: uint32,
	},
);

Operations.void_result = new Serializer('void_result');

Operations.asset = new Serializer(
	'asset',
	{
		amount: int64,
		asset_id: protocol_id_type('asset'),
	},
);

const operation_result = static_variant([
	Operations.void_result,
	object_id_type,
	Operations.asset,
]);

Operations.processed_transaction = new Serializer(
	'processed_transaction',
	{
		ref_block_num: uint16,
		ref_block_prefix: uint32,
		expiration: time_point_sec,
		operations: array(operation),
		extensions: set(futureExtensions),
		signatures: array(bytes(65)),
		operation_results: array(operation_result),
	},
);

Operations.signed_block = new Serializer(
	'signed_block',
	{
		previous: bytes(20),
		timestamp: time_point_sec,
		transaction_merkle_root: bytes(20),
		extensions: set(futureExtensions),
		transactions: array(Operations.processed_transaction),
	},
);

Operations.block_header = new Serializer(
	'block_header',
	{
		previous: bytes(20),
		timestamp: time_point_sec,
		transaction_merkle_root: bytes(20),
		extensions: set(futureExtensions),
	},
);

Operations.signed_block_header = new Serializer(
	'signed_block_header',
	{
		previous: bytes(20),
		timestamp: time_point_sec,
		transaction_merkle_root: bytes(20),
		extensions: set(futureExtensions),
	},
);

Operations.transfer = new Serializer(
	'transfer',
	{
		fee: Operations.asset,
		from: protocol_id_type('account'),
		to: protocol_id_type('account'),
		amount: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.limit_order_create = new Serializer(
	'limit_order_create',
	{
		fee: Operations.asset,
		seller: protocol_id_type('account'),
		amount_to_sell: Operations.asset,
		min_to_receive: Operations.asset,
		expiration: time_point_sec,
		fill_or_kill: bool,
		extensions: set(futureExtensions),
	},
);

Operations.limit_order_cancel = new Serializer(
	'limit_order_cancel',
	{
		fee: Operations.asset,
		fee_paying_account: protocol_id_type('account'),
		order: protocol_id_type('limit_order'),
		extensions: set(futureExtensions),
	},
);

Operations.call_order_update = new Serializer(
	'call_order_update',
	{
		fee: Operations.asset,
		funding_account: protocol_id_type('account'),
		delta_collateral: Operations.asset,
		delta_debt: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.fill_order = new Serializer(
	'fill_order',
	{
		fee: Operations.asset,
		order_id: object_id_type,
		account_id: protocol_id_type('account'),
		pays: Operations.asset,
		receives: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.authority = new Serializer(
	'authority',
	{
		weight_threshold: uint32,
		account_auths: map((protocol_id_type('account')), (uint16)),
		key_auths: map((public_key), (uint16)),
	},
);

Operations.account_options = new Serializer(
	'account_options',
	{
		voting_account: protocol_id_type('account'),
		delegating_account: protocol_id_type('account'),
		num_committee: uint16,
		votes: set(vote_id),
		extensions: set(futureExtensions),
	},
);

Operations.account_create = new Serializer(
	'account_create',
	{
		fee: Operations.asset,
		registrar: protocol_id_type('account'),
		referrer: protocol_id_type('account'),
		referrer_percent: uint16,
		name: string,
		active: Operations.authority,
		echorand_key: bytes(32),
		options: Operations.account_options,
		extensions: set(futureExtensions),
	},
);

Operations.account_update = new Serializer(
	'account_update',
	{
		fee: Operations.asset,
		account: protocol_id_type('account'),
		active: optional(Operations.authority),
		echorand_key: optional(bytes(32)),
		new_options: optional(Operations.account_options),
		extensions: set(futureExtensions),
	},
);

Operations.account_whitelist = new Serializer(
	'account_whitelist',
	{
		fee: Operations.asset,
		authorizing_account: protocol_id_type('account'),
		account_to_list: protocol_id_type('account'),
		new_listing: uint8,
		extensions: set(futureExtensions),
	},
);

Operations.account_upgrade = new Serializer(
	'account_upgrade',
	{
		fee: Operations.asset,
		account_to_upgrade: protocol_id_type('account'),
		upgrade_to_lifetime_member: bool,
		extensions: set(futureExtensions),
	},
);

Operations.account_transfer = new Serializer(
	'account_transfer',
	{
		fee: Operations.asset,
		account_id: protocol_id_type('account'),
		new_owner: protocol_id_type('account'),
		extensions: set(futureExtensions),
	},
);

Operations.price = new Serializer(
	'price',
	{
		base: Operations.asset,
		quote: Operations.asset,
	},
);

Operations.asset_options = new Serializer(
	'asset_options',
	{
		max_supply: int64,
		market_fee_percent: uint16,
		max_market_fee: int64,
		issuer_permissions: uint16,
		flags: uint16,
		core_exchange_rate: Operations.price,
		whitelist_authorities: set(protocol_id_type('account')),
		blacklist_authorities: set(protocol_id_type('account')),
		whitelist_markets: set(protocol_id_type('asset')),
		blacklist_markets: set(protocol_id_type('asset')),
		description: string,
		extensions: set(futureExtensions),
	},
);

Operations.bitasset_options = new Serializer(
	'bitasset_options',
	{
		feed_lifetime_sec: uint32,
		minimum_feeds: uint8,
		force_settlement_delay_sec: uint32,
		force_settlement_offset_percent: uint16,
		maximum_force_settlement_volume: uint16,
		short_backing_asset: protocol_id_type('asset'),
		extensions: set(futureExtensions),
	},
);

Operations.asset_create = new Serializer(
	'asset_create',
	{
		fee: Operations.asset,
		issuer: protocol_id_type('account'),
		symbol: string,
		precision: uint8,
		common_options: Operations.asset_options,
		bitasset_opts: optional(Operations.bitasset_options),
		is_prediction_market: bool,
		extensions: set(futureExtensions),
	},
);

Operations.asset_update = new Serializer(
	'asset_update',
	{
		fee: Operations.asset,
		issuer: protocol_id_type('account'),
		asset_to_update: protocol_id_type('asset'),
		new_issuer: optional(protocol_id_type('account')),
		new_options: Operations.asset_options,
		extensions: set(futureExtensions),
	},
);

Operations.asset_update_bitasset = new Serializer(
	'asset_update_bitasset',
	{
		fee: Operations.asset,
		issuer: protocol_id_type('account'),
		asset_to_update: protocol_id_type('asset'),
		new_options: Operations.bitasset_options,
		extensions: set(futureExtensions),
	},
);

Operations.asset_update_feed_producers = new Serializer(
	'asset_update_feed_producers',
	{
		fee: Operations.asset,
		issuer: protocol_id_type('account'),
		asset_to_update: protocol_id_type('asset'),
		new_feed_producers: set(protocol_id_type('account')),
		extensions: set(futureExtensions),
	},
);

Operations.asset_issue = new Serializer(
	'asset_issue',
	{
		fee: Operations.asset,
		issuer: protocol_id_type('account'),
		asset_to_issue: Operations.asset,
		issue_to_account: protocol_id_type('account'),
		extensions: set(futureExtensions),
	},
);

Operations.asset_reserve = new Serializer(
	'asset_reserve',
	{
		fee: Operations.asset,
		payer: protocol_id_type('account'),
		amount_to_reserve: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.asset_fund_fee_pool = new Serializer(
	'asset_fund_fee_pool',
	{
		fee: Operations.asset,
		from_account: protocol_id_type('account'),
		asset_id: protocol_id_type('asset'),
		amount: int64,
		extensions: set(futureExtensions),
	},
);

Operations.asset_settle = new Serializer(
	'asset_settle',
	{
		fee: Operations.asset,
		account: protocol_id_type('account'),
		amount: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.asset_global_settle = new Serializer(
	'asset_global_settle',
	{
		fee: Operations.asset,
		issuer: protocol_id_type('account'),
		asset_to_settle: protocol_id_type('asset'),
		settle_price: Operations.price,
		extensions: set(futureExtensions),
	},
);

Operations.price_feed = new Serializer(
	'price_feed',
	{
		settlement_price: Operations.price,
		maintenance_collateral_ratio: uint16,
		maximum_short_squeeze_ratio: uint16,
		core_exchange_rate: Operations.price,
	},
);

Operations.asset_publish_feed = new Serializer(
	'asset_publish_feed',
	{
		fee: Operations.asset,
		publisher: protocol_id_type('account'),
		asset_id: protocol_id_type('asset'),
		feed: Operations.price_feed,
		extensions: set(futureExtensions),
	},
);

Operations.op_wrapper = new Serializer(
	'op_wrapper',
	{ op: operation },
);

Operations.proposal_create = new Serializer(
	'proposal_create',
	{
		fee: Operations.asset,
		fee_paying_account: protocol_id_type('account'),
		expiration_time: time_point_sec,
		proposed_ops: array(Operations.op_wrapper),
		review_period_seconds: optional(uint32),
		extensions: set(futureExtensions),
	},
);

Operations.proposal_update = new Serializer(
	'proposal_update',
	{
		fee: Operations.asset,
		fee_paying_account: protocol_id_type('account'),
		proposal: protocol_id_type('proposal'),
		active_approvals_to_add: set(protocol_id_type('account')),
		active_approvals_to_remove: set(protocol_id_type('account')),
		owner_approvals_to_add: set(protocol_id_type('account')),
		owner_approvals_to_remove: set(protocol_id_type('account')),
		key_approvals_to_add: set(public_key),
		key_approvals_to_remove: set(public_key),
		extensions: set(futureExtensions),
	},
);

Operations.proposal_delete = new Serializer(
	'proposal_delete',
	{
		fee: Operations.asset,
		fee_paying_account: protocol_id_type('account'),
		using_owner_authority: bool,
		proposal: protocol_id_type('proposal'),
		extensions: set(futureExtensions),
	},
);

Operations.withdraw_permission_create = new Serializer(
	'withdraw_permission_create',
	{
		fee: Operations.asset,
		withdraw_from_account: protocol_id_type('account'),
		authorized_account: protocol_id_type('account'),
		withdrawal_limit: Operations.asset,
		withdrawal_period_sec: uint32,
		periods_until_expiration: uint32,
		period_start_time: time_point_sec,
	},
);

Operations.withdraw_permission_update = new Serializer(
	'withdraw_permission_update',
	{
		fee: Operations.asset,
		withdraw_from_account: protocol_id_type('account'),
		authorized_account: protocol_id_type('account'),
		permission_to_update: protocol_id_type('withdraw_permission'),
		withdrawal_limit: Operations.asset,
		withdrawal_period_sec: uint32,
		period_start_time: time_point_sec,
		periods_until_expiration: uint32,
	},
);

Operations.withdraw_permission_claim = new Serializer(
	'withdraw_permission_claim',
	{
		fee: Operations.asset,
		withdraw_permission: protocol_id_type('withdraw_permission'),
		withdraw_from_account: protocol_id_type('account'),
		withdraw_to_account: protocol_id_type('account'),
		amount_to_withdraw: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.withdraw_permission_delete = new Serializer(
	'withdraw_permission_delete',
	{
		fee: Operations.asset,
		withdraw_from_account: protocol_id_type('account'),
		authorized_account: protocol_id_type('account'),
		withdrawal_permission: protocol_id_type('withdraw_permission'),
		extensions: set(futureExtensions),
	},
);

Operations.committee_member_create = new Serializer(
	'committee_member_create',
	{
		fee: Operations.asset,
		committee_member_account: protocol_id_type('account'),
		url: string,
		extensions: set(futureExtensions),
	},
);

Operations.committee_member_update = new Serializer(
	'committee_member_update',
	{
		fee: Operations.asset,
		committee_member: protocol_id_type('committee_member'),
		committee_member_account: protocol_id_type('account'),
		new_url: optional(string),
		extensions: set(futureExtensions),
	},
);

Operations.chain_parameters = new Serializer(
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
		maximum_committee_count: uint16,
		maximum_authority_membership: uint16,
		reserve_percent_of_fee: uint16,
		network_percent_of_fee: uint16,
		lifetime_referrer_percent_of_fee: uint16,
		cashback_vesting_period_seconds: uint32,
		cashback_vesting_threshold: int64,
		count_non_member_votes: bool,
		allow_non_member_whitelists: bool,
		max_predicate_opcode: uint16,
		fee_liquidation_threshold: int64,
		accounts_per_fee_scale: uint16,
		account_fee_scale_bitshifts: uint8,
		max_authority_depth: uint8,
		extensions: set(futureExtensions),
	},
);

Operations.committee_member_update_global_parameters = new Serializer(
	'committee_member_update_global_parameters',
	{
		fee: Operations.asset,
		new_parameters: Operations.chain_parameters,
		extensions: set(futureExtensions),
	},
);

Operations.linear_vesting_policy_initializer = new Serializer(
	'linear_vesting_policy_initializer',
	{
		begin_timestamp: time_point_sec,
		vesting_cliff_seconds: uint32,
		vesting_duration_seconds: uint32,
	},
);

Operations.cdd_vesting_policy_initializer = new Serializer(
	'cdd_vesting_policy_initializer',
	{
		start_claim: time_point_sec,
		vesting_seconds: uint32,
	},
);

const vesting_policy_initializer = static_variant([
	Operations.linear_vesting_policy_initializer,
	Operations.cdd_vesting_policy_initializer,
]);

Operations.vesting_balance_create = new Serializer(
	'vesting_balance_create',
	{
		fee: Operations.asset,
		creator: protocol_id_type('account'),
		owner: protocol_id_type('account'),
		amount: Operations.asset,
		policy: vesting_policy_initializer,
		extensions: set(futureExtensions),
	},
);

Operations.vesting_balance_withdraw = new Serializer(
	'vesting_balance_withdraw',
	{
		fee: Operations.asset,
		vesting_balance: protocol_id_type('vesting_balance'),
		owner: protocol_id_type('account'),
		amount: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.custom = new Serializer(
	'custom',
	{
		fee: Operations.asset,
		payer: protocol_id_type('account'),
		required_auths: set(protocol_id_type('account')),
		id: uint16,
		data: bytes(),
		extensions: set(futureExtensions),
	},
);

Operations.account_name_eq_lit_predicate = new Serializer(
	'account_name_eq_lit_predicate',
	{
		account_id: protocol_id_type('account'),
		name: string,
	},
);

Operations.asset_symbol_eq_lit_predicate = new Serializer(
	'asset_symbol_eq_lit_predicate',
	{
		asset_id: protocol_id_type('asset'),
		symbol: string,
	},
);

Operations.block_id_predicate = new Serializer(
	'block_id_predicate',
	{ id: bytes(20) },
);

const predicate = static_variant([
	Operations.account_name_eq_lit_predicate,
	Operations.asset_symbol_eq_lit_predicate,
	Operations.block_id_predicate,
]);

Operations.assert = new Serializer(
	'assert',
	{
		fee: Operations.asset,
		fee_paying_account: protocol_id_type('account'),
		predicates: array(predicate),
		required_auths: set(protocol_id_type('account')),
		extensions: set(futureExtensions),
	},
);

Operations.balance_claim = new Serializer(
	'balance_claim',
	{
		fee: Operations.asset,
		deposit_to_account: protocol_id_type('account'),
		balance_to_claim: protocol_id_type('balance'),
		balance_owner_key: public_key,
		total_claimed: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.override_transfer = new Serializer(
	'override_transfer',
	{
		fee: Operations.asset,
		issuer: protocol_id_type('account'),
		from: protocol_id_type('account'),
		to: protocol_id_type('account'),
		amount: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.asset_settle_cancel = new Serializer(
	'asset_settle_cancel',
	{
		fee: Operations.asset,
		settlement: protocol_id_type('force_settlement'),
		account: protocol_id_type('account'),
		amount: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.asset_claim_fees = new Serializer(
	'asset_claim_fees',
	{
		fee: Operations.asset,
		issuer: protocol_id_type('account'),
		amount_to_claim: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.create_contract = new Serializer(
	'create_contract',
	{
		fee: Operations.asset,
		registrar: protocol_id_type('account'),
		value: Operations.asset,
		code: string,
		supported_asset_id: optional(protocol_id_type('asset')),
		eth_accuracy: bool,
		extensions: set(futureExtensions),
	},
);

Operations.call_contract = new Serializer(
	'call_contract',
	{
		fee: Operations.asset,
		registrar: protocol_id_type('account'),
		value: Operations.asset,
		code: string,
		callee: protocol_id_type('contract'),
		extensions: set(futureExtensions),
	},
);

Operations.contract_transfer = new Serializer(
	'contract_transfer',
	{
		fee: Operations.asset,
		from: protocol_id_type('contract'),
		to: protocol_id_type('contract'),
		amount: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.change_sidechain_config = new Serializer(
	'change_sidechain_config',
	{
		fee: Operations.asset,
		from: protocol_id_type('contract'),
		amount: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.account_address_create = new Serializer(
	'account_address_create',
	{
		fee: Operations.asset,
		owner: protocol_id_type('account'),
		label: string,
		extensions: set(futureExtensions),
	},
);

Operations.generate_eth_address = new Serializer(
	'generate_eth_address',
	{
		fee: Operations.asset,
		account: protocol_id_type('account'),
		extensions: set(futureExtensions),
	},
);

Operations.create_eth_address = new Serializer(
	'create_eth_address',
	{
		fee: Operations.asset,
		account: protocol_id_type('account'),
		committee_member_id: protocol_id_type('committee_member'),
		extensions: set(futureExtensions),
	},
);

Operations.deposit_eth = new Serializer(
	'deposit_eth',
	{
		fee: Operations.asset,
		from: protocol_id_type('account'),
		committee_member_id: protocol_id_type('committee_member'),
		amount: Operations.asset,
	},
);

Operations.withdraw_eth = new Serializer(
	'withdraw_eth',
	{
		fee: Operations.asset,
		account: protocol_id_type('account'),
		eth_addr: string,
		amount: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.approve_withdraw_eth = new Serializer(
	'approve_withdraw_eth',
	{
		fee: Operations.asset,
		committee_member_id: protocol_id_type('committee_member'),
		extensions: set(futureExtensions),
	},
);

Operations.contract_fund_pool = new Serializer(
	'contract_fund_pool',
	{
		fee: Operations.asset,
		account: protocol_id_type('account'),
		committee_member_id: protocol_id_type('contract'),
		amount: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.contract_whitelist = new Serializer(
	'contract_whitelist',
	{
		fee: Operations.asset,
		sender: protocol_id_type('account'),
		contract: protocol_id_type('contract'),
		extensions: set(futureExtensions),
	},
);

Operations.sidechain_issue = new Serializer(
	'sidechain_issue',
	{
		fee: Operations.asset,
		account: protocol_id_type('account'),
		deposit_id: protocol_id_type('deposit_eth'),
		amount: Operations.asset,
		extensions: set(futureExtensions),
	},
);

Operations.sidechain_burn = new Serializer(
	'sidechain_burn',
	{
		fee: Operations.asset,
		sender: protocol_id_type('account'),
		contract: protocol_id_type('contract'),
		extensions: set(futureExtensions),
	},
);

Operations.register_erc20_token = new Serializer(
	'register_erc20_token',
	{
		fee: Operations.asset,
		account: protocol_id_type('account'),
		eth_addr: protocol_id_type('eth_address'),
		extensions: set(futureExtensions),
	},
);

Operations.deposit_erc20_token = new Serializer(
	'deposit_erc20_token',
	{
		fee: Operations.asset,
		committee_member_id: protocol_id_type('account'),
		erc20_token_addr: protocol_id_type('eth_address'),
		transaction_hash: uint64,
		extensions: set(futureExtensions),
	},
);

Operations.withdrawErc20Token = new Serializer(
	'withdrawErc20Token',
	{
		fee: Operations.asset,
		account: protocol_id_type('account'),
		to: protocol_id_type('eth_address'),
		erc20_token: protocol_id_type('erc20_token'),
		extensions: set(futureExtensions),
	},
);

Operations.approve_erc20_token_withdraw = new Serializer(
	'approve_erc20_token_withdraw',
	{
		fee: Operations.asset,
		committee_member_id: protocol_id_type('account'),
		to: protocol_id_type('eth_address'),
		ransaction_hash: uint64,
		extensions: set(futureExtensions),
	},
);

Operations.contract_update = new Serializer(
	'contract_update',
	{
		fee: Operations.asset,
		committee_member_id: protocol_id_type('account'),
		to: protocol_id_type('eth_address'),
		ransaction_hash: uint64,
		extensions: set(futureExtensions),
	},
);

operation.st_operations = [
	/*  0 */ Operations.transfer,
	/*  1 */ Operations.limit_order_create,
	/*  2 */ Operations.limit_order_cancel,
	/*  3 */ Operations.call_order_update,
	/*  4 */ Operations.fill_order,
	/*  5 */ Operations.account_create,
	/*  6 */ Operations.account_update,
	/*  7 */ Operations.account_whitelist,
	/*  8 */ Operations.account_upgrade,
	/*  9 */ Operations.account_transfer,
	/* 10 */ Operations.asset_create,
	/* 11 */ Operations.asset_update,
	/* 12 */ Operations.asset_update_bitasset,
	/* 13 */ Operations.asset_update_feed_producers,
	/* 14 */ Operations.asset_issue,
	/* 15 */ Operations.asset_reserve,
	/* 16 */ Operations.asset_fund_fee_pool,
	/* 17 */ Operations.asset_settle,
	/* 18 */ Operations.asset_global_settle,
	/* 19 */ Operations.asset_publish_feed,
	/* 20 */ Operations.proposal_create,
	/* 21 */ Operations.proposal_update,
	/* 22 */ Operations.proposal_delete,
	/* 23 */ Operations.withdraw_permission_create,
	/* 24 */ Operations.withdraw_permission_update,
	/* 25 */ Operations.withdraw_permission_claim,
	/* 26 */ Operations.withdraw_permission_delete,
	/* 27 */ Operations.committee_member_create,
	/* 28 */ Operations.committee_member_update,
	/* 29 */ Operations.committee_member_update_global_parameters,
	/* 30 */ Operations.vesting_balance_create,
	/* 31 */ Operations.vesting_balance_withdraw,
	/* 32 */ Operations.custom,
	/* 33 */ Operations.assert,
	/* 34 */ Operations.balance_claim,
	/* 35 */ Operations.override_transfer,
	/* 36 */ Operations.asset_settle_cancel,
	/* 37 */ Operations.asset_claim_fees,
	/* 38 */ Operations.bid_collateral,
	/* 39 */ Operations.execute_bid,
	/* 40 */ Operations.create_contract,
	/* 41 */ Operations.call_contract,
	/* 42 */ Operations.contract_transfer,
	/* 43 */ Operations.change_sidechain_config,
	/* 44 */ Operations.account_address_create,
	/* 45 */ Operations.transfer_to_address,
	/* 46 */ Operations.generate_eth_address,
	/* 47 */ Operations.create_eth_address,
	/* 48 */ Operations.deposit_eth,
	/* 49 */ Operations.withdraw_eth,
	/* 50 */ Operations.approve_withdraw_eth,
	/* 51 */ Operations.contract_fund_pool,
	/* 52 */ Operations.contract_whitelist,
	/* 53 */ Operations.sidechain_issue,
	/* 54 */ Operations.sidechain_burn,
	/* 55 */ Operations.register_erc20_token,
	/* 56 */ Operations.deposit_erc20_token,
	/* 57 */ Operations.withdraw_erc20_token,
	/* 58 */ Operations.approve_erc20_token_withdraw,
	/* 59 */ Operations.contract_update,
];

Operations.transaction = new Serializer(
	'transaction',
	{
		ref_block_num: uint16,
		ref_block_prefix: uint32,
		expiration: time_point_sec,
		operations: array(operation),
		extensions: set(futureExtensions),
	},
);

Operations.signed_transaction = new Serializer(
	'signed_transaction',
	{
		ref_block_num: uint16,
		ref_block_prefix: uint32,
		expiration: time_point_sec,
		operations: array(operation),
		extensions: set(futureExtensions),
		signatures: array(bytes(64)),
	},
);
// # -------------------------------
// #  Generated code end
// # -------------------------------

// Custom Types

Operations.stealth_memo_data = new Serializer('stealth_memo_data', {
	from: optional(public_key),
	amount: Operations.asset,
	blinding_factor: bytes(32),
	commitment: bytes(33),
	check: uint32,
});

module.exports = {
	...Operations,
	...feeParameters,
	operation,
};
