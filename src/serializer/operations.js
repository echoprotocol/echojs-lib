/* eslint-disable max-len */
import Operation from './operation';

import {
	int64, uint64, uint32, uint16, uint8, string, bool, bytes, hex,
	protocolIdType, publicKey, chainParameters, timePointSec,
	authority, accountOptions, price, assetOptions, bitassetOptions,
	blindInput, priceFeed, asset, vestingPolicyInitializer,
	workerInitializer, predicate, blindOutput,
	array, set, operation, memoData, optional, emptyArray,
} from './types';

/** @type {{[name:string]:Operation}} */
export const Operations = {};
export const Transactions = {};

Operations.transfer = new Operation(
	0,
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
	1,
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
	2,
	{
		fee: asset,
		fee_paying_account: protocolIdType('account'),
		order: protocolIdType('limit_order'),
		extensions: emptyArray,
	},
);

Operations.callOrderUpdate = new Operation(
	3,
	{
		fee: asset,
		funding_account: protocolIdType('account'),
		delta_collateral: asset,
		delta_debt: asset,
		extensions: emptyArray,
	},
);

Operations.accountCreate = new Operation(
	5,
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
	6,
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
	7,
	{
		fee: asset,
		authorizing_account: protocolIdType('account'),
		account_to_list: protocolIdType('account'),
		new_listing: uint8,
		extensions: emptyArray,
	},
);

Operations.accountUpgrade = new Operation(
	8,
	{
		fee: asset,
		account_to_upgrade: protocolIdType('account'),
		upgrade_to_lifetime_member: bool,
		extensions: emptyArray,
	},
);

Operations.accountTransfer = new Operation(
	9,
	{
		fee: asset,
		account_id: protocolIdType('account'),
		new_owner: protocolIdType('account'),
		extensions: emptyArray,
	},
);

Operations.assetCreate = new Operation(
	10,
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
	11,
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
	12,
	{
		fee: asset,
		issuer: protocolIdType('account'),
		asset_to_update: protocolIdType('asset'),
		new_options: bitassetOptions,
		extensions: emptyArray,
	},
);

Operations.assetUpdateFeedProducers = new Operation(
	13,
	{
		fee: asset,
		issuer: protocolIdType('account'),
		asset_to_update: protocolIdType('asset'),
		new_feed_producers: set(protocolIdType('account')),
		extensions: emptyArray,
	},
);

Operations.assetIssue = new Operation(
	14,
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
	15,
	{
		fee: asset,
		payer: protocolIdType('account'),
		amount_to_reserve: asset,
		extensions: emptyArray,
	},
);

Operations.assetFundFeePool = new Operation(
	16,
	{
		fee: asset,
		from_account: protocolIdType('account'),
		asset_id: protocolIdType('asset'),
		amount: int64,
		extensions: emptyArray,
	},
);

Operations.assetSettle = new Operation(
	17,
	{
		fee: asset,
		account: protocolIdType('account'),
		amount: asset,
		extensions: emptyArray,
	},
);

Operations.assetGlobalSettle = new Operation(
	18,
	{
		fee: asset,
		issuer: protocolIdType('account'),
		asset_to_settle: protocolIdType('asset'),
		settle_price: price,
		extensions: emptyArray,
	},
);

Operations.assetPublishFeed = new Operation(
	19,
	{
		fee: asset,
		publisher: protocolIdType('account'),
		asset_id: protocolIdType('asset'),
		feed: priceFeed,
		extensions: emptyArray,
	},
);

Operations.witnessCreate = new Operation(
	20,
	{
		fee: asset,
		witness_account: protocolIdType('account'),
		url: string,
		block_signing_key: publicKey,
	},
);

Operations.witnessUpdate = new Operation(
	21,
	{
		fee: asset,
		witness: protocolIdType('witness'),
		witness_account: protocolIdType('account'),
		new_url: optional(string),
		new_signing_key: optional(publicKey),
	},
);

Operations.proposalCreate = new Operation(
	22,
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
	23,
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
	24,
	{
		fee: asset,
		fee_paying_account: protocolIdType('account'),
		using_owner_authority: bool,
		proposal: protocolIdType('proposal'),
		extensions: emptyArray,
	},
);

Operations.withdrawPermission_create = new Operation(
	25,
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
	26,
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
	27,
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
	28,
	{
		fee: asset,
		withdraw_from_account: protocolIdType('account'),
		authorized_account: protocolIdType('account'),
		withdrawal_permission: protocolIdType('withdraw_permission'),
	},
);

Operations.committeeMemberCreate = new Operation(
	29,
	{
		fee: asset,
		committee_member_account: protocolIdType('account'),
		url: string,
	},
);

Operations.committeeMemberUpdate = new Operation(
	30,
	{
		fee: asset,
		committee_member: protocolIdType('committee_member'),
		committee_member_account: protocolIdType('account'),
		new_url: optional(string),
	},
);

Operations.committeeMemberUpdateGlobalParameters = new Operation(
	31,
	{
		fee: asset,
		new_parameters: chainParameters,
	},
);

Operations.vestingBalanceCreate = new Operation(
	32,
	{
		fee: asset,
		creator: protocolIdType('account'),
		owner: protocolIdType('account'),
		amount: asset,
		policy: vestingPolicyInitializer,
	},
);

Operations.vestingBalanceWithdraw = new Operation(
	33,
	{
		fee: asset,
		vesting_balance: protocolIdType('vesting_balance'),
		owner: protocolIdType('account'),
		amount: asset,
	},
);

Operations.workerCreate = new Operation(
	34,
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
	35,
	{
		fee: asset,
		payer: protocolIdType('account'),
		required_auths: set(protocolIdType('account')),
		id: uint16,
		data: bytes(),
	},
);

Operations.assert = new Operation(
	36,
	{
		fee: asset,
		fee_paying_account: protocolIdType('account'),
		predicates: array(predicate),
		required_auths: set(protocolIdType('account')),
		extensions: emptyArray,
	},
);

Operations.balanceClaim = new Operation(
	37,
	{
		fee: asset,
		deposit_to_account: protocolIdType('account'),
		balance_to_claim: protocolIdType('balance'),
		balance_owner_key: publicKey,
		total_claimed: asset,
	},
);

Operations.overrideTransfer = new Operation(
	38,
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
	39,
	{
		fee: asset,
		amount: asset,
		from: protocolIdType('account'),
		blinding_factor: bytes(32),
		outputs: array(blindOutput),
	},
);

Operations.blindTransfer = new Operation(
	40,
	{
		fee: asset,
		inputs: array(blindInput),
		outputs: array(blindOutput),
	},
);

Operations.transferFromBlind = new Operation(
	41,
	{
		fee: asset,
		amount: asset,
		to: protocolIdType('account'),
		blinding_factor: bytes(32),
		inputs: array(blindInput),
	},
);

Operations.assetClaimFees = new Operation(
	43,
	{
		fee: asset,
		issuer: protocolIdType('account'),
		amount_to_claim: asset,
		extensions: emptyArray,
	},
);

Operations.bidCollateral = new Operation(
	45,
	{
		fee: asset,
		bidder: protocolIdType('account'),
		additional_collateral: asset,
		debt_covered: asset,
		extensions: emptyArray,
	},
);

Operations.contract = new Operation(
	47,
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
	48,
	{
		fee: asset,
		from: protocolIdType('contract'),
		to: protocolIdType('contract'),
		amount: asset,
		extensions: emptyArray,
	},
);


Transactions.transaction = new Operation(
	'transaction',
	{
		ref_block_num: uint16,
		ref_block_prefix: uint32,
		expiration: timePointSec,
		operations: array(operation(Operations)),
		extensions: emptyArray,
	},
);

Transactions.signedTransaction = new Operation(
	'signed_transaction',
	{
		ref_block_num: uint16,
		ref_block_prefix: uint32,
		expiration: timePointSec,
		operations: array(operation(Operations)),
		extensions: emptyArray,
		signatures: array(hex),
	},
);
