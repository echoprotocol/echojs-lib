/* eslint-disable max-len */
import Operation from './operation';

import {
	int64, uint64, uint32, uint16, uint8, string, bool, bytes,
	protocolIdType, publicKey, chainParameters, timePointSec,
	authority, accountOptions, price, assetOptions, bitassetOptions,
	blindInput, priceFeed, asset, vestingPolicyInitializer,
	workerInitializer, predicate, blindOutput,
	array, set, operation, memoData, optional, emptyArray,
} from './types';

const Operations = {};

Operations.transfer = new Operation(
	'transfer',
	{
		fee: asset,
		from: protocolIdType('account'),
		to: protocolIdType('account'),
		amount: asset,
		memo: optional(memoData),
		extensions: emptyArray,
	},
);

Operations.limitOrderCreate = new Operation(
	'limit_order_create',
	{
		fee: asset,
		seller: protocolIdType('account'),
		amount_to_sell: asset,
		min_to_receive: asset,
		expiration: timePointSec, // time_point_sec
		fill_or_kill: bool,
		extensions: emptyArray,
	},
);

Operations.limitOrderCancel = new Operation(
	'limit_order_cancel',
	{
		fee: asset,
		fee_paying_account: protocolIdType('account'),
		order: protocolIdType('limit_order'),
		extensions: emptyArray,
	},
);

Operations.callOrderUpdate = new Operation(
	'call_order_update',
	{
		fee: asset,
		funding_account: protocolIdType('account'),
		delta_collateral: asset,
		delta_debt: asset,
		extensions: emptyArray,
	},
);

Operations.bidCollateral = new Operation(
	'bid_collateral',
	{
		fee: asset,
		bidder: protocolIdType('account'),
		additional_collateral: asset,
		debt_covered: asset,
		extensions: emptyArray,
	},
);

Operations.accountCreate = new Operation(
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
		extensions: emptyArray,
	},
);

Operations.accountUpdate = new Operation(
	'account_update',
	{
		fee: asset,
		account: protocolIdType('account'),
		owner: optional(authority),
		active: optional(authority),
		new_options: optional(accountOptions),
		extensions: emptyArray,
	},
);

Operations.accountWhitelist = new Operation(
	'account_whitelist',
	{
		fee: asset,
		authorizing_account: protocolIdType('account'),
		account_to_list: protocolIdType('account'),
		new_listing: uint8,
		extensions: emptyArray,
	},
);

Operations.accountUpgrade = new Operation(
	'account_upgrade',
	{
		fee: asset,
		account_to_upgrade: protocolIdType('account'),
		upgrade_to_lifetime_member: bool,
		extensions: emptyArray,
	},
);

Operations.accountTransfer = new Operation(
	'account_transfer',
	{
		fee: asset,
		account_id: protocolIdType('account'),
		new_owner: protocolIdType('account'),
		extensions: emptyArray,
	},
);

Operations.assetCreate = new Operation(
	'asset_create',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		symbol: string,
		precision: uint8,
		common_options: assetOptions,
		bitasset_opts: optional(bitassetOptions),
		is_prediction_market: bool,
		extensions: emptyArray,
	},
);

Operations.assetUpdate = new Operation(
	'asset_update',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		asset_to_update: protocolIdType('asset'),
		new_issuer: optional(protocolIdType('account')),
		new_options: assetOptions,
		extensions: emptyArray,
	},
);

Operations.assetUpdate_bitasset = new Operation(
	'asset_update_bitasset',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		asset_to_update: protocolIdType('asset'),
		new_options: bitassetOptions,
		extensions: emptyArray,
	},
);

Operations.assetUpdateFeedProducers = new Operation(
	'asset_update_feed_producers',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		asset_to_update: protocolIdType('asset'),
		new_feed_producers: set(protocolIdType('account')),
		extensions: emptyArray,
	},
);

Operations.assetIssue = new Operation(
	'asset_issue',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		asset_to_issue: asset,
		issue_to_account: protocolIdType('account'),
		memo: optional(memoData),
		extensions: emptyArray,
	},
);

Operations.assetReserve = new Operation(
	'asset_reserve',
	{
		fee: asset,
		payer: protocolIdType('account'),
		amount_to_reserve: asset,
		extensions: emptyArray,
	},
);

Operations.assetFundFeePool = new Operation(
	'asset_fund_fee_pool',
	{
		fee: asset,
		from_account: protocolIdType('account'),
		asset_id: protocolIdType('asset'),
		amount: int64,
		extensions: emptyArray,
	},
);

Operations.assetSettle = new Operation(
	'asset_settle',
	{
		fee: asset,
		account: protocolIdType('account'),
		amount: asset,
		extensions: emptyArray,
	},
);

Operations.assetGlobalSettle = new Operation(
	'asset_global_settle',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		asset_to_settle: protocolIdType('asset'),
		settle_price: price,
		extensions: emptyArray,
	},
);

Operations.assetPublishFeed = new Operation(
	'asset_publish_feed',
	{
		fee: asset,
		publisher: protocolIdType('account'),
		asset_id: protocolIdType('asset'),
		feed: priceFeed,
		extensions: emptyArray,
	},
);

Operations.witnessCreate = new Operation(
	'witness_create',
	{
		fee: asset,
		witness_account: protocolIdType('account'),
		url: string,
		block_signing_key: publicKey,
	},
);

Operations.witnessUpdate = new Operation(
	'witness_update',
	{
		fee: asset,
		witness: protocolIdType('witness'),
		witness_account: protocolIdType('account'),
		new_url: optional(string),
		new_signing_key: optional(publicKey),
	},
);

Operations.proposalCreate = new Operation(
	'proposal_create',
	{
		fee: asset,
		fee_paying_account: protocolIdType('account'),
		expiration_time: timePointSec, // time_point_sec
		proposed_ops: array(operation(Operations)),
		review_period_seconds: optional(uint32),
		extensions: emptyArray,
	},
);

Operations.proposalUpdate = new Operation(
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
		extensions: emptyArray,
	},
);

Operations.proposalDelete = new Operation(
	'proposal_delete',
	{
		fee: asset,
		fee_paying_account: protocolIdType('account'),
		using_owner_authority: bool,
		proposal: protocolIdType('proposal'),
		extensions: emptyArray,
	},
);

Operations.withdrawPermission_create = new Operation(
	'withdraw_permission_create',
	{
		fee: asset,
		withdraw_from_account: protocolIdType('account'),
		authorized_account: protocolIdType('account'),
		withdrawal_limit: asset,
		withdrawal_period_sec: uint32,
		periods_until_expiration: uint32,
		period_start_time: timePointSec, // time_point_sec
	},
);

Operations.withdrawPermissionUpdate = new Operation(
	'withdraw_permission_update',
	{
		fee: asset,
		withdraw_from_account: protocolIdType('account'),
		authorized_account: protocolIdType('account'),
		permission_to_update: protocolIdType('withdraw_permission'),
		withdrawal_limit: asset,
		withdrawal_period_sec: uint32,
		period_start_time: timePointSec, // time_point_sec
		periods_until_expiration: uint32,
	},
);

Operations.withdrawPermissionClaim = new Operation(
	'withdraw_permission_claim',
	{
		fee: asset,
		withdraw_permission: protocolIdType('withdraw_permission'),
		withdraw_from_account: protocolIdType('account'),
		withdraw_to_account: protocolIdType('account'),
		amount_to_withdraw: asset,
		memo: optional(memoData),
	},
);

Operations.withdrawPermissionDelete = new Operation(
	'withdraw_permission_delete',
	{
		fee: asset,
		withdraw_from_account: protocolIdType('account'),
		authorized_account: protocolIdType('account'),
		withdrawal_permission: protocolIdType('withdraw_permission'),
	},
);

Operations.vestingBalanceCreate = new Operation(
	'vesting_balance_create',
	{
		fee: asset,
		creator: protocolIdType('account'),
		owner: protocolIdType('account'),
		amount: asset,
		policy: vestingPolicyInitializer,
	},
);

Operations.vestingBalanceWithdraw = new Operation(
	'vesting_balance_withdraw',
	{
		fee: asset,
		vesting_balance: protocolIdType('vesting_balance'),
		owner: protocolIdType('account'),
		amount: asset,
	},
);

Operations.workerCreate = new Operation(
	'worker_create',
	{
		fee: asset,
		owner: protocolIdType('account'),
		work_begin_date: timePointSec, // time_point_sec
		work_end_date: timePointSec, // time_point_sec
		daily_pay: int64,
		name: string,
		url: string,
		initializer: workerInitializer,
	},
);

Operations.custom = new Operation(
	'custom',
	{
		fee: asset,
		payer: protocolIdType('account'),
		required_auths: set(protocolIdType('account')),
		id: uint16,
		data: bytes(),
	},
);

Operations.assert = new Operation(
	'assert',
	{
		fee: asset,
		fee_paying_account: protocolIdType('account'),
		predicates: array(predicate),
		required_auths: set(protocolIdType('account')),
		extensions: emptyArray,
	},
);

Operations.balanceClaim = new Operation(
	'balance_claim',
	{
		fee: asset,
		deposit_to_account: protocolIdType('account'),
		balance_to_claim: protocolIdType('balance'),
		balance_owner_key: publicKey,
		total_claimed: asset,
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
		new_parameters: chainParameters,
	},
);

Operations.overrideTransfer = new Operation(
	'override_transfer',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		from: protocolIdType('account'),
		to: protocolIdType('account'),
		amount: asset,
		memo: optional(memoData),
		extensions: emptyArray,
	},
);

Operations.transferToBlind = new Operation(
	'transfer_to_blind',
	{
		fee: asset,
		amount: asset,
		from: protocolIdType('account'),
		blinding_factor: bytes(32),
		outputs: array(blindOutput),
	},
);

Operations.blindTransfer = new Operation(
	'blind_transfer',
	{
		fee: asset,
		inputs: array(blindInput),
		outputs: array(blindOutput),
	},
);

Operations.transferFromBlind = new Operation(
	'transfer_from_blind',
	{
		fee: asset,
		amount: asset,
		to: protocolIdType('account'),
		blinding_factor: bytes(32),
		inputs: array(blindInput),
	},
);

Operations.assetClaimFees = new Operation(
	'asset_claim_fees',
	{
		fee: asset,
		issuer: protocolIdType('account'),
		amount_to_claim: asset,
		extensions: emptyArray,
	},
);

Operations.contract = new Operation(
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

Operations.contractTransfer = new Operation(
	'contract_transfer',
	{
		fee: asset,
		from: protocolIdType('contract'),
		to: protocolIdType('contract'),
		amount: asset,
		extensions: emptyArray,
	},
);

export default Operations;
