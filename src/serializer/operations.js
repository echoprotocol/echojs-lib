import Operation from './operation';

import {
	int64, uint64, uint32, uint16, uint8, string, bool, bytes,
	protocolIdType, objectId, publicKey,
	authority, accountOptions, price, assetOptions,
	array, set, map, operation, asset, memoData, optional, object,
	custom,
} from './types';

const Operations = {};

Operations.transfer = new Operation( // OK
	'transfer',
	{
		fee: asset,
		from: protocolIdType('account'),
		to: protocolIdType('account'),
		amount: asset,
		memo: optional(memoData),
		extensions: optional(object),
	},
);

Operations.limitOrderCreate = new Operation( // OK
	'limit_order_create',
	{
		fee: asset,
		seller: protocolIdType('account'),
		amount_to_sell: asset,
		min_to_receive: asset,
		expiration: uint64, // time_point_sec
		fill_or_kill: bool,
		extensions: optional(object),
	},
);

Operations.limitOrderCancel = new Operation( // OK
	'limit_order_cancel',
	{
		fee: asset,
		fee_paying_account: protocolIdType('account'),
		order: protocolIdType('limit_order'),
		extensions: optional(object),
	},
);

Operations.callOrderUpdate = new Operation( // OK
	'call_order_update',
	{
		fee: asset,
		funding_account: protocolIdType('account'),
		delta_collateral: asset,
		delta_debt: asset,
		extensions: optional(object),
	},
);

Operations.fillOrder = new Operation( // OK
	'fill_order',
	{
		fee: asset,
		order_id: objectId,
		account_id: protocolIdType('account'),
		pays: asset,
		receives: asset,
	},
);

Operations.accountCreate = new Operation( // OK
	'account_create',
	{
		fee: asset,
		registrar: protocolIdType('account'),
		referrer: protocolIdType('account'),
		referrer_percent: uint16,
		name: string,
		owner: authority,
		active: authority,
		options: accountOptions,
		extensions: optional(object),
	},
);

Operations.accountUpdate = new Operation( // OK
	'account_update',
	{
		fee: asset,
		account: protocolIdType('account'),
		owner: optional(authority),
		active: optional(authority),
		new_options: optional(accountOptions),
		extensions: optional(object),
	},
);

Operations.accountWhitelist = new Operation( // OK
	'account_whitelist',
	{
		fee: asset,
		authorizing_account: protocolIdType('account'),
		account_to_list: protocolIdType('account'),
		new_listing: uint8,
		extensions: optional(object),
	},
);

Operations.accountUpgrade = new Operation( // OK
	'account_upgrade',
	{
		fee: asset,
		account_to_upgrade: protocolIdType('account'),
		upgrade_to_lifetime_member: bool,
		extensions: optional(object),
	},
);

Operations.accountTransfer = new Operation( // OK
	'account_transfer',
	{
		fee: asset,
		account_id: protocolIdType('account'),
		new_owner: protocolIdType('account'),
		extensions: optional(object),
	},
);

Operations.bitassetOptions = new Operation(
	'bitasset_options',
	{
		feed_lifetime_sec: uint32,
		minimum_feeds: uint8,
		force_settlement_delay_sec: uint32,
		force_settlement_offset_percent: uint16,
		maximum_force_settlement_volume: uint16,
		short_backing_asset: protocolIdType('asset'),
		extensions: optional(object),
	},
);

Operations.assetCreate = new Operation( // OK
	'asset_create',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		symbol: string,
		precision: uint8,
		common_options: assetOptions,
		bitasset_opts: optional(Operations.bitasset_options),
		is_prediction_market: bool,
		extensions: optional(object),
	},
);

Operations.assetUpdate = new Operation( // OK
	'asset_update',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		asset_to_update: protocolIdType('asset'),
		new_issuer: optional(protocolIdType('account')),
		new_options: assetOptions,
		extensions: optional(object),
	},
);

Operations.assetUpdate_bitasset = new Operation( // OK
	'asset_update_bitasset',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		asset_to_update: protocolIdType('asset'),
		new_options: Operations.bitasset_options,
		extensions: optional(object),
	},
);

Operations.assetUpdateFeedProducers = new Operation( // OK
	'asset_update_feed_producers',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		asset_to_update: protocolIdType('asset'),
		new_feed_producers: set(protocolIdType('account')),
		extensions: optional(object),
	},
);

Operations.assetIssue = new Operation( // OK
	'asset_issue',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		asset_to_issue: asset,
		issue_to_account: protocolIdType('account'),
		memo: optional(Operations.memo_data),
		extensions: optional(object),
	},
);

Operations.assetReserve = new Operation( // OK
	'asset_reserve',
	{
		fee: asset,
		payer: protocolIdType('account'),
		amount_to_reserve: asset,
		extensions: optional(object),
	},
);

Operations.assetFundFeePool = new Operation( // OK
	'asset_fund_fee_pool',
	{
		fee: asset,
		from_account: protocolIdType('account'),
		asset_id: protocolIdType('asset'),
		amount: int64,
		extensions: optional(object),
	},
);

Operations.assetSettle = new Operation( // OK
	'asset_settle',
	{
		fee: asset,
		account: protocolIdType('account'),
		amount: asset,
		extensions: optional(object),
	},
);

Operations.assetGlobalSettle = new Operation( // OK
	'asset_global_settle',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		asset_to_settle: protocolIdType('asset'),
		settle_price: price,
		extensions: optional(object),
	},
);

Operations.priceFeed = new Operation(
	'price_feed',
	{
		settlement_price: Operations.price,
		maintenance_collateral_ratio: uint16,
		maximum_short_squeeze_ratio: uint16,
		core_exchange_rate: Operations.price,
	},
);

Operations.assetPublishFeed = new Operation( // OK
	'asset_publish_feed',
	{
		fee: asset,
		publisher: protocolIdType('account'),
		asset_id: protocolIdType('asset'),
		feed: Operations.price_feed,
		extensions: optional(object),
	},
);

Operations.witnessCreate = new Operation( // OK
	'witness_create',
	{
		fee: asset,
		witness_account: protocolIdType('account'),
		url: string,
		block_signing_key: publicKey,
	},
);

Operations.witnessUpdate = new Operation( // OK
	'witness_update',
	{
		fee: asset,
		witness: protocolIdType('witness'),
		witness_account: protocolIdType('account'),
		new_url: optional(string),
		new_signing_key: optional(publicKey),
	},
);

Operations.opWrapper = new Operation(
	'op_wrapper',
	{ op: operation },
);

Operations.proposalCreate = new Operation( // OK
	'proposal_create',
	{
		fee: asset,
		fee_paying_account: protocolIdType('account'),
		expiration_time: uint64, // time_point_sec
		proposed_ops: array(Operations.op_wrapper),
		review_period_seconds: optional(uint32),
		extensions: optional(object),
	},
);

Operations.proposalUpdate = new Operation( // OK
	'proposal_update',
	{
		fee: asset,
		fee_paying_account: protocolIdType('account'),
		proposal: protocolIdType('proposal'),
		active_approvals_to_add: set(protocolIdType('account')),
		active_approvals_to_remove: set(protocolIdType('account')),
		owner_approvals_to_add: set(protocolIdType('account')),
		owner_approvals_to_remove: set(protocolIdType('account')),
		key_approvals_to_add: set(publicKey),
		key_approvals_to_remove: set(publicKey),
		extensions: optional(object),
	},
);

Operations.proposalDelete = new Operation( // OK
	'proposal_delete',
	{
		fee: asset,
		fee_paying_account: protocolIdType('account'),
		using_owner_authority: bool,
		proposal: protocolIdType('proposal'),
		extensions: optional(object),
	},
);

Operations.withdrawPermission_create = new Operation( // OK
	'withdraw_permission_create',
	{
		fee: asset,
		withdraw_from_account: protocolIdType('account'),
		authorized_account: protocolIdType('account'),
		withdrawal_limit: asset,
		withdrawal_period_sec: uint32,
		periods_until_expiration: uint32,
		period_start_time: uint64, // time_point_sec
	},
);

Operations.withdrawPermissionUpdate = new Operation( // OK
	'withdraw_permission_update',
	{
		fee: asset,
		withdraw_from_account: protocolIdType('account'),
		authorized_account: protocolIdType('account'),
		permission_to_update: protocolIdType('withdraw_permission'),
		withdrawal_limit: asset,
		withdrawal_period_sec: uint32,
		period_start_time: uint64, // time_point_sec
		periods_until_expiration: uint32,
	},
);

Operations.withdrawPermissionClaim = new Operation( // OK
	'withdraw_permission_claim',
	{
		fee: asset,
		withdraw_permission: protocolIdType('withdraw_permission'),
		withdraw_from_account: protocolIdType('account'),
		withdraw_to_account: protocolIdType('account'),
		amount_to_withdraw: asset,
		memo: optional(Operations.memo_data),
	},
);

Operations.withdrawPermissionDelete = new Operation( // OK
	'withdraw_permission_delete',
	{
		fee: asset,
		withdraw_from_account: protocolIdType('account'),
		authorized_account: protocolIdType('account'),
		withdrawal_permission: protocolIdType('withdraw_permission'),
	},
);

Operations.committeeMemberCreate = new Operation(
	'committee_member_create',
	{
		fee: asset,
		committee_member_account: protocolIdType('account'),
		url: string,
	},
);

Operations.committeeMemberUpdate = new Operation(
	'committee_member_update',
	{
		fee: asset,
		committee_member: protocolIdType('committee_member'),
		committee_member_account: protocolIdType('account'),
		new_url: optional(string),
	},
);

Operations.committeeMemberUpdateGlobalParameters = new Operation(
	'committee_member_update_global_parameters',
	{
		fee: asset,
		new_parameters: Operations.chain_parameters,
	},
);

Operations.linearVestingPolicyInitializer = new Operation(
	'linear_vesting_policy_initializer',
	{
		begin_timestamp: uint64, // time_point_sec
		vesting_cliff_seconds: uint32,
		vesting_duration_seconds: uint32,
	},
);

Operations.cddVestingPolicyInitializer = new Operation(
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

Operations.vestingBalanceCreate = new Operation( // OK
	'vesting_balance_create',
	{
		fee: asset,
		creator: protocolIdType('account'),
		owner: protocolIdType('account'),
		amount: asset,
		policy: vesting_policy_initializer,
	},
);

Operations.vestingBalanceWithdraw = new Operation( // OK
	'vesting_balance_withdraw',
	{
		fee: asset,
		vesting_balance: protocolIdType('vesting_balance'),
		owner: protocolIdType('account'),
		amount: asset,
	},
);

Operations.refund_worker_initializer = new Operation('refund_worker_initializer');

Operations.vestingBalanceWorkerInitializer = new Operation(
	'vesting_balance_worker_initializer',
	{ pay_vesting_period_days: uint16 },
);

Operations.burn_worker_initializer = new Operation('burn_worker_initializer');

const workerInitializer = static_variant([
	Operations.refund_worker_initializer,
	Operations.vesting_balance_worker_initializer,
	Operations.burn_worker_initializer,
]);

Operations.workerCreate = new Operation( // OK
	'worker_create',
	{
		fee: asset,
		owner: protocolIdType('account'),
		work_begin_date: uint64, // time_point_sec
		work_end_date: uint64, // time_point_sec
		daily_pay: int64,
		name: string,
		url: string,
		initializer: worker_initializer,
	},
);

Operations.custom = new Operation( // OK
	'custom',
	{
		fee: asset,
		payer: protocolIdType('account'),
		required_auths: set(protocolIdType('account')),
		id: uint16,
		data: bytes(),
	},
);

Operations.account_name_eq_lit_predicate = new Operation(
	'account_name_eq_lit_predicate',
	{
		account_id: protocolIdType('account'),
		name: string,
	},
);

Operations.asset_symbol_eq_lit_predicate = new Operation(
	'asset_symbol_eq_lit_predicate',
	{
		asset_id: protocolIdType('asset'),
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

Operations.assert = new Operation( // OK
	'assert',
	{
		fee: asset,
		fee_paying_account: protocolIdType('account'),
		predicates: array(predicate),
		required_auths: set(protocolIdType('account')),
		extensions: optional(object),
	},
);

Operations.balanceClaim = new Operation( // OK
	'balance_claim',
	{
		fee: asset,
		deposit_to_account: protocolIdType('account'),
		balance_to_claim: protocolIdType('balance'),
		balance_owner_key: publicKey,
		total_claimed: asset,
	},
);

Operations.overrideTransfer = new Operation( // OK
	'override_transfer',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		from: protocolIdType('account'),
		to: protocolIdType('account'),
		amount: asset,
		memo: optional(Operations.memo_data),
		extensions: optional(object),
	},
);

Operations.stealthConfirmation = new Operation(
	'stealth_confirmation',
	{
		one_time_key: publicKey,
		to: optional(publicKey),
		encrypted_memo: bytes(),
	},
);

Operations.blindOutput = new Operation(
	'blind_output',
	{
		commitment: bytes(33),
		range_proof: bytes(),
		owner: authority,
		stealth_memo: optional(Operations.stealth_confirmation),
	},
);

Operations.transferToBlind = new Operation( // OK
	'transfer_to_blind',
	{
		fee: asset,
		amount: asset,
		from: protocolIdType('account'),
		blinding_factor: bytes(32),
		outputs: array(Operations.blind_output),
	},
);

Operations.blindInput = new Operation(
	'blind_input',
	{
		commitment: bytes(33),
		owner: authority,
	},
);

Operations.blindTransfer = new Operation( // OK
	'blind_transfer',
	{
		fee: asset,
		inputs: array(Operations.blind_input),
		outputs: array(Operations.blind_output),
	},
);

Operations.transferFromBlind = new Operation( // OK
	'transfer_from_blind',
	{
		fee: asset,
		amount: asset,
		to: protocolIdType('account'),
		blinding_factor: bytes(32),
		inputs: array(Operations.blind_input),
	},
);

Operations.assetSettleCancel = new Operation( // OK
	'asset_settle_cancel',
	{
		fee: asset,
		settlement: protocolIdType('force_settlement'),
		account: protocolIdType('account'),
		amount: asset,
		extensions: optional(object),
	},
);

Operations.assetClaimFees = new Operation( // OK
	'asset_claim_fees',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		amount_to_claim: asset,
		extensions: optional(object),
	},
);

Operations.contract = new Operation( // OK
	'contract',
	{
		fee: asset,
		registrar: protocolIdType('account'),
		receiver: optional(protocolIdType('contract')),
		asset_id: protocolIdType('asset'),
		value: uint64,
		gasPrice: uint64,
		gas: uint64,
		code: string,
	},
);

Operations.contractTransfer = new Operation( // OK
	'contract_transfer',
	{
		fee: asset,
		from: protocolIdType('contract'),
		to: protocolIdType('contract'),
		amount: asset,
		extensions: optional(object),
	},
);

