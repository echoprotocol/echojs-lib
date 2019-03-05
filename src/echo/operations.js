/* eslint-disable import/prefer-default-export */
import operation from '../serializer/operation';

import {
	accountOptions,
	asset,
	assetOptions,
	authority,
	bitassetOptions,
	memoData,
	price,
	priceFeed,
	chainParameters,
	vestingPolicyInitializer,
	workerInitializer,
	predicate,
	blindOutput,
	blindInput,
	operationWrapper,
} from '../serializer/composit-types';

import {
	array,
	bytes,
	bool,
	empty,
	int64,
	objectId,
	optional,
	protocolId,
	publicKey,
	set,
	string,
	timePointSec,
	uint8,
	uint16,
	uint32,
} from '../serializer/basic-types';

import {
	TRANSFER,
	LIMIT_ORDER_CREATE,
	LIMIT_ORDER_CANCEL,
	CALL_ORDER_UPDATE,
	FILL_ORDER,
	ACCOUNT_CREATE,
	ACCOUNT_UPDATE,
	ACCOUNT_WHITELIST,
	ACCOUNT_UPGRADE,
	ACCOUNT_TRANSFER,
	ASSET_CREATE,
	ASSET_UPDATE,
	ASSET_UPDATE_BITASSET,
	ASSET_UPDATE_FEED_PRODUCERS,
	ASSET_ISSUE,
	ASSET_RESERVE,
	ASSET_FUND_FEE_POOL,
	ASSET_SETTLE,
	ASSET_GLOBAL_SETTLE,
	ASSET_PUBLISH_FEED,
	WITNESS_CREATE,
	WITNESS_UPDATE,
	PROPOSAL_CREATE,
	PROPOSAL_UPDATE,
	PROPOSAL_DELETE,
	WITHDRAW_PERMISSION_CREATE,
	WITHDRAW_PERMISSION_UPDATE,
	WITHDRAW_PERMISSION_CLAIM,
	WITHDRAW_PERMISSION_DELETE,
	COMMITTEE_MEMBER_CREATE,
	COMMITTEE_MEMBER_UPDATE,
	COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS,
	VESTING_BALANCE_CREATE,
	VESTING_BALANCE_WITHDRAW,
	WORKER_CREATE,
	CUSTOM,
	ASSERT,
	BALANCE_CLAIM,
	OVERRIDE_TRANSFER,
	TRANSFER_TO_BLIND,
	BLIND_TRANSFER,
	TRANSFER_FROM_BLIND,
	ASSET_SETTLE_CANCEL,
	ASSET_CLAIM_FEES,
	CREATE_CONTRACT,
	CALL_CONTRACT,
	CONTRACT_TRANSFER,
} from '../constants/operations-ids';

import {
	ACCOUNT,
	LIMIT_ORDER,
	ASSET,
	WITNESS,
	PROPOSAL,
	WITHDRAW_PERMISSION,
	COMMITTEE_MEMBER,
	VESTING_BALANCE,
	BALANCE,
	FORCE_SETTLEMENT,
	CONTRACT,
} from '../constants/object-types';

/** @typedef {import('../serializer/operation').Operation} Operation */

export const transfer = operation(TRANSFER, {
	fee: asset,
	from: protocolId(ACCOUNT),
	to: protocolId(ACCOUNT),
	amount: asset,
	memo: optional(memoData),
	extensions: optional(empty),
});

export const limitOrderCreate = operation(LIMIT_ORDER_CREATE, {
	fee: asset,
	seller: protocolId(ACCOUNT),
	amount_to_sell: asset,
	min_to_receive: asset,
	expiration: timePointSec,
	fill_or_kill: bool,
	extensions: optional(empty),
});

export const limitOrderCancel = operation(LIMIT_ORDER_CANCEL, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	order: protocolId(LIMIT_ORDER),
	extensions: optional(empty),
});

export const callOrderUpdate = operation(CALL_ORDER_UPDATE, {
	fee: asset,
	funding_account: protocolId(ACCOUNT),
	delta_collateral: asset,
	delta_debt: asset,
	extensions: optional(empty),
});

export const fillOrder = operation(FILL_ORDER, {
	fee: asset,
	order_id: objectId,
	account_id: protocolId(ACCOUNT),
	pays: asset,
	receives: asset,
});

export const accountCreate = operation(ACCOUNT_CREATE, {
	fee: asset,
	registrar: protocolId(ACCOUNT),
	referrer: protocolId(ACCOUNT),
	referrer_percent: uint16,
	name: string,
	owner: authority,
	active: authority,
	ed_key: bytes(32),
	options: accountOptions,
	extensions: optional(empty),
});

export const accountUpdate = operation(ACCOUNT_UPDATE, {
	fee: asset,
	account: protocolId(ACCOUNT),
	owner: optional(authority),
	active: optional(authority),
	ed_key: optional(bytes(32)),
	new_options: optional(accountOptions),
	extensions: optional(empty),
});

export const accountWhitelist = operation(ACCOUNT_WHITELIST, {
	fee: asset,
	authorizing_account: protocolId(ACCOUNT),
	account_to_list: protocolId(ACCOUNT),
	new_listing: uint8,
	extensions: optional(empty),
});

export const accountUpgrade = operation(ACCOUNT_UPGRADE, {
	fee: asset,
	account_to_upgrade: protocolId(ACCOUNT),
	upgrade_to_lifetime_member: bool,
	extensions: optional(empty),
});

export const accountTransfer = operation(ACCOUNT_TRANSFER, {
	fee: asset,
	account_id: protocolId(ACCOUNT),
	new_owner: protocolId(ACCOUNT),
	extensions: optional(empty),
});

export const assetCreate = operation(ASSET_CREATE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	symbol: string,
	precision: uint8,
	common_options: assetOptions,
	bitasset_opts: optional(bitassetOptions),
	is_prediction_market: bool,
	extensions: optional(empty),
});

export const assetUpdate = operation(ASSET_UPDATE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_issuer: optional(protocolId(ACCOUNT)),
	new_options: assetOptions,
	extensions: optional(empty),
});

export const assetUpdateBitasset = operation(ASSET_UPDATE_BITASSET, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_options: bitassetOptions,
	extensions: optional(empty),
});

export const assetUpdateFeedProducers = operation(ASSET_UPDATE_FEED_PRODUCERS, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_feed_producers: set(protocolId(ACCOUNT)),
	extensions: optional(empty),
});

export const assetIssue = operation(ASSET_ISSUE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_issue: asset,
	issue_to_account: protocolId(ACCOUNT),
	memo: optional(memoData),
	extensions: optional(empty),
});

export const assetReserve = operation(ASSET_RESERVE, {
	fee: asset,
	payer: protocolId(ACCOUNT),
	amount_to_reserve: asset,
	extensions: optional(empty),
});

export const assetFundFeePool = operation(ASSET_FUND_FEE_POOL, {
	fee: asset,
	from_account: protocolId(ACCOUNT),
	asset_id: protocolId(ASSET),
	amount: int64,
	extensions: optional(empty),
});

export const assetSettle = operation(ASSET_SETTLE, {
	fee: asset,
	account: protocolId(ACCOUNT),
	amount: asset,
	extensions: optional(empty),
});

export const assetGlobalSettle = operation(ASSET_GLOBAL_SETTLE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_settle: protocolId(ASSET),
	settle_price: price,
	extensions: optional(empty),
});

export const assetPublishFeed = operation(ASSET_PUBLISH_FEED, {
	fee: asset,
	publisher: protocolId(ACCOUNT),
	asset_id: protocolId(ASSET),
	feed: priceFeed,
	extensions: optional(empty),
});

export const witnessCreate = operation(WITNESS_CREATE, {
	fee: asset,
	witness_account: protocolId(ACCOUNT),
	url: string,
	block_signing_key: publicKey,
});

export const witnessUpdate = operation(WITNESS_UPDATE, {
	fee: asset,
	witness: protocolId(WITNESS),
	witness_account: protocolId(ACCOUNT),
	new_url: optional(string),
	new_signing_key: optional(publicKey),
});

export const proposalCreate = operation(PROPOSAL_CREATE, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	expiration_time: timePointSec,
	proposed_ops: array(operationWrapper),
	review_period_seconds: optional(uint32),
	extensions: optional(empty),
});

export const proposalUpdate = operation(PROPOSAL_UPDATE, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	proposal: protocolId(PROPOSAL),
	active_approvals_to_add: set(protocolId(ACCOUNT)),
	active_approvals_to_remove: set(protocolId(ACCOUNT)),
	owner_approvals_to_add: set(protocolId(ACCOUNT)),
	owner_approvals_to_remove: set(protocolId(ACCOUNT)),
	key_approvals_to_add: set(publicKey),
	key_approvals_to_remove: set(publicKey),
	extensions: optional(empty),
});

export const proposalDelete = operation(PROPOSAL_DELETE, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	using_owner_authority: bool,
	proposal: protocolId(PROPOSAL),
	extensions: optional(empty),
});

export const withdrawPermissionCreate = operation(WITHDRAW_PERMISSION_CREATE, {
	fee: asset,
	withdraw_from_account: protocolId(ACCOUNT),
	authorized_account: protocolId(ACCOUNT),
	withdrawal_limit: asset,
	withdrawal_period_sec: uint32,
	periods_until_expiration: uint32,
	period_start_time: timePointSec,
});

export const withdrawPermissionUpdate = operation(WITHDRAW_PERMISSION_UPDATE, {
	fee: asset,
	withdraw_from_account: protocolId(ACCOUNT),
	authorized_account: protocolId(ACCOUNT),
	permission_to_update: protocolId(WITHDRAW_PERMISSION),
	withdrawal_limit: asset,
	withdrawal_period_sec: uint32,
	period_start_time: timePointSec,
	periods_until_expiration: uint32,
});

export const withdrawPermissionClaim = operation(WITHDRAW_PERMISSION_CLAIM, {
	fee: asset,
	withdraw_permission: protocolId(WITHDRAW_PERMISSION),
	withdraw_from_account: protocolId(ACCOUNT),
	withdraw_to_account: protocolId(ACCOUNT),
	amount_to_withdraw: asset,
	memo: optional(memoData),
});

export const withdrawPermissionDelete = operation(WITHDRAW_PERMISSION_DELETE, {
	fee: asset,
	withdraw_from_account: protocolId(ACCOUNT),
	authorized_account: protocolId(ACCOUNT),
	withdrawal_permission: protocolId(WITHDRAW_PERMISSION),
});

export const committeeMemberCreate = operation(COMMITTEE_MEMBER_CREATE, {
	fee: asset,
	committee_member_account: protocolId(ACCOUNT),
	url: string,
});

export const committeeMemberUpdate = operation(COMMITTEE_MEMBER_UPDATE, {
	fee: asset,
	committee_member: protocolId(COMMITTEE_MEMBER),
	committee_member_account: protocolId(ACCOUNT),
	new_url: optional(string),
});

export const committeeMemberUpdateGlobalParameters = operation(COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS, {
	fee: asset,
	new_parameters: chainParameters,
});

export const vestingBalanceCreate = operation(VESTING_BALANCE_CREATE, {
	fee: asset,
	creator: protocolId(ACCOUNT),
	owner: protocolId(ACCOUNT),
	amount: asset,
	policy: vestingPolicyInitializer,
});

export const vestingBalanceWithdraw = operation(VESTING_BALANCE_WITHDRAW, {
	fee: asset,
	vesting_balance: protocolId(VESTING_BALANCE),
	owner: protocolId(ACCOUNT),
	amount: asset,
});

export const workerCreate = operation(WORKER_CREATE, {
	fee: asset,
	owner: protocolId(ACCOUNT),
	work_begin_date: timePointSec,
	work_end_date: timePointSec,
	daily_pay: int64,
	name: string,
	url: string,
	initializer: workerInitializer,
});

export const custom = operation(CUSTOM, {
	fee: asset,
	payer: protocolId(ACCOUNT),
	required_auths: set(protocolId(ACCOUNT)),
	id: uint16,
	data: bytes(),
});

export const assert = operation(ASSERT, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	predicates: array(predicate),
	required_auths: set(protocolId(ACCOUNT)),
	extensions: optional(empty),
});

export const balanceClaim = operation(BALANCE_CLAIM, {
	fee: asset,
	deposit_to_account: protocolId(ACCOUNT),
	balance_to_claim: protocolId(BALANCE),
	balance_owner_key: publicKey,
	total_claimed: asset,
});

export const overrideTransfer = operation(OVERRIDE_TRANSFER, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	from: protocolId(ACCOUNT),
	to: protocolId(ACCOUNT),
	amount: asset,
	memo: optional(memoData),
	extensions: optional(empty),
});

export const transferToBlind = operation(TRANSFER_TO_BLIND, {
	fee: asset,
	amount: asset,
	from: protocolId(ACCOUNT),
	blinding_factor: bytes(32),
	outputs: array(blindOutput),
});

export const blindTransfer = operation(BLIND_TRANSFER, {
	fee: asset,
	inputs: array(blindInput),
	outputs: array(blindOutput),
});

export const transferFromBlind = operation(TRANSFER_FROM_BLIND, {
	fee: asset,
	amount: asset,
	to: protocolId(ACCOUNT),
	blinding_factor: bytes(32),
	inputs: array(blindInput),
});

export const assetSettleCancel = operation(ASSET_SETTLE_CANCEL, {
	fee: asset,
	settlement: protocolId(FORCE_SETTLEMENT),
	account: protocolId(ACCOUNT),
	amount: asset,
	extensions: optional(empty),
});

export const assetClaimFees = operation(ASSET_CLAIM_FEES, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	amount_to_claim: asset,
	extensions: optional(empty),
});

export const createContract = operation(CREATE_CONTRACT, {
	fee: asset,
	registrar: protocolId(ACCOUNT),
	value: asset,
	code: string,
	eth_accuracy: bool,
	supported_asset_id: optional(protocolId(ASSET)),
});

export const callContract = operation(CALL_CONTRACT, {
	fee: asset,
	registrar: protocolId(ACCOUNT),
	value: asset,
	code: string,
	callee: protocolId(CONTRACT),
});

export const contractTransfer = operation(CONTRACT_TRANSFER, {
	fee: asset,
	from: protocolId(CONTRACT),
	to: protocolId([ACCOUNT, CONTRACT]),
	amount: asset,
	extensions: optional(empty),
});

/** @type {{[operationName:string]:Operation}} */
export const operationByName = {
	transfer,
	limitOrderCreate,
	limitOrderCancel,
	callOrderUpdate,
	fillOrder,
	accountCreate,
	accountUpdate,
	accountWhitelist,
	accountUpgrade,
	accountTransfer,
	assetCreate,
	assetUpdate,
	assetUpdateBitasset,
	assetUpdateFeedProducers,
	assetIssue,
	assetReserve,
	assetFundFeePool,
	assetSettle,
	assetGlobalSettle,
	assetPublishFeed,
	witnessCreate,
	witnessUpdate,
	proposalCreate,
	proposalUpdate,
	proposalDelete,
	withdrawPermissionCreate,
	withdrawPermissionUpdate,
	withdrawPermissionClaim,
	withdrawPermissionDelete,
	committeeMemberCreate,
	committeeMemberUpdate,
	committeeMemberUpdateGlobalParameters,
	vestingBalanceCreate,
	vestingBalanceWithdraw,
	workerCreate,
	custom,
	assert,
	balanceClaim,
	overrideTransfer,
	transferToBlind,
	blindTransfer,
	transferFromBlind,
	assetSettleCancel,
	assetClaimFees,
	createContract,
	callContract,
	contractTransfer,
};

/** @type {Array<Operation>} */
export const allOperations = Object.values(operationByName);

/** @type {{[id:number]:Operation}} */
export const operationById = allOperations.reduce((acc, op) => {
	acc[op.id] = op;
	return acc;
}, {});

operationWrapper.types = operationById;
