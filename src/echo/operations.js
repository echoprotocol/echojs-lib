/* eslint-disable import/prefer-default-export */
import operation from '../serializer/operation';

import {
	accountOptions,
	asset,
	assetOptions,
	authority,
	bitassetOptions,
	price,
	priceFeed,
	chainParameters,
	vestingPolicyInitializer,
	predicate,
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
	CUSTOM,
	ASSERT,
	BALANCE_CLAIM,
	OVERRIDE_TRANSFER,
	ASSET_SETTLE_CANCEL,
	ASSET_CLAIM_FEES,
	BID_COLLATERAL,
	EXECUTE_BID,
	CREATE_CONTRACT,
	CALL_CONTRACT,
	CONTRACT_TRANSFER,
} from '../constants/operations-ids';

import {
	ACCOUNT,
	LIMIT_ORDER,
	ASSET,
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
	extensions: optional(empty),
}); // 0

export const limitOrderCreate = operation(LIMIT_ORDER_CREATE, {
	fee: asset,
	seller: protocolId(ACCOUNT),
	amount_to_sell: asset,
	min_to_receive: asset,
	expiration: timePointSec,
	fill_or_kill: bool,
	extensions: optional(empty),
}); // 1

export const limitOrderCancel = operation(LIMIT_ORDER_CANCEL, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	order: protocolId(LIMIT_ORDER),
	extensions: optional(empty),
}); // 2

export const callOrderUpdate = operation(CALL_ORDER_UPDATE, {
	fee: asset,
	funding_account: protocolId(ACCOUNT),
	delta_collateral: asset,
	delta_debt: asset,
	extensions: optional(empty),
}); // 3

export const fillOrder = operation(FILL_ORDER, {
	fee: asset,
	order_id: objectId,
	account_id: protocolId(ACCOUNT),
	pays: asset,
	receives: asset,
}); // 4

export const accountCreate = operation(ACCOUNT_CREATE, {
	fee: asset,
	registrar: protocolId(ACCOUNT),
	referrer: protocolId(ACCOUNT),
	referrer_percent: uint16,
	name: string,
	active: authority,
	echorand_key: publicKey,
	options: accountOptions,
	extensions: optional(empty),
}); // 5

export const accountUpdate = operation(ACCOUNT_UPDATE, {
	fee: asset,
	account: protocolId(ACCOUNT),
	active: optional(authority),
	// ed_key: optional(bytes(32)),
	echorand_key: optional(publicKey),
	new_options: optional(accountOptions),
	extensions: optional(empty),
}); // 6

export const accountWhitelist = operation(ACCOUNT_WHITELIST, {
	fee: asset,
	authorizing_account: protocolId(ACCOUNT),
	account_to_list: protocolId(ACCOUNT),
	new_listing: uint8,
	extensions: optional(empty),
}); // 7

export const accountUpgrade = operation(ACCOUNT_UPGRADE, {
	fee: asset,
	account_to_upgrade: protocolId(ACCOUNT),
	upgrade_to_lifetime_member: bool,
	extensions: optional(empty),
}); // 8

export const accountTransfer = operation(ACCOUNT_TRANSFER, {
	fee: asset,
	account_id: protocolId(ACCOUNT),
	new_owner: protocolId(ACCOUNT),
	extensions: optional(empty),
}); // 9

export const assetCreate = operation(ASSET_CREATE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	symbol: string,
	precision: uint8,
	common_options: assetOptions,
	bitasset_opts: optional(bitassetOptions),
	is_prediction_market: bool,
	extensions: optional(empty),
}); // 10

export const assetUpdate = operation(ASSET_UPDATE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_issuer: optional(protocolId(ACCOUNT)),
	new_options: assetOptions,
	extensions: optional(empty),
}); // 11

export const assetUpdateBitasset = operation(ASSET_UPDATE_BITASSET, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_options: bitassetOptions,
	extensions: optional(empty),
}); // 12

export const assetUpdateFeedProducers = operation(ASSET_UPDATE_FEED_PRODUCERS, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_feed_producers: set(protocolId(ACCOUNT)),
	extensions: optional(empty),
}); // 13

export const assetIssue = operation(ASSET_ISSUE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_issue: asset,
	issue_to_account: protocolId(ACCOUNT),
	extensions: optional(empty),
}); // 14

export const assetReserve = operation(ASSET_RESERVE, {
	fee: asset,
	payer: protocolId(ACCOUNT),
	amount_to_reserve: asset,
	extensions: optional(empty),
}); // 15

export const assetFundFeePool = operation(ASSET_FUND_FEE_POOL, {
	fee: asset,
	from_account: protocolId(ACCOUNT),
	asset_id: protocolId(ASSET),
	amount: int64,
	extensions: optional(empty),
}); // 16

export const assetSettle = operation(ASSET_SETTLE, {
	fee: asset,
	account: protocolId(ACCOUNT),
	amount: asset,
	extensions: optional(empty),
}); // 17

export const assetGlobalSettle = operation(ASSET_GLOBAL_SETTLE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_settle: protocolId(ASSET),
	settle_price: price,
	extensions: optional(empty),
}); // 18

export const assetPublishFeed = operation(ASSET_PUBLISH_FEED, {
	fee: asset,
	publisher: protocolId(ACCOUNT),
	asset_id: protocolId(ASSET),
	feed: priceFeed,
	extensions: optional(empty),
}); // 19

export const proposalCreate = operation(PROPOSAL_CREATE, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	expiration_time: timePointSec,
	proposed_ops: array(operationWrapper),
	review_period_seconds: optional(uint32),
	extensions: optional(empty),
}); // 20

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
}); // 21

export const proposalDelete = operation(PROPOSAL_DELETE, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	using_owner_authority: bool,
	proposal: protocolId(PROPOSAL),
	extensions: optional(empty),
}); // 22

export const withdrawPermissionCreate = operation(WITHDRAW_PERMISSION_CREATE, {
	fee: asset,
	withdraw_from_account: protocolId(ACCOUNT),
	authorized_account: protocolId(ACCOUNT),
	withdrawal_limit: asset,
	withdrawal_period_sec: uint32,
	periods_until_expiration: uint32,
	period_start_time: timePointSec,
}); // 23

export const withdrawPermissionUpdate = operation(WITHDRAW_PERMISSION_UPDATE, {
	fee: asset,
	withdraw_from_account: protocolId(ACCOUNT),
	authorized_account: protocolId(ACCOUNT),
	permission_to_update: protocolId(WITHDRAW_PERMISSION),
	withdrawal_limit: asset,
	withdrawal_period_sec: uint32,
	period_start_time: timePointSec,
	periods_until_expiration: uint32,
}); // 24

export const withdrawPermissionClaim = operation(WITHDRAW_PERMISSION_CLAIM, {
	fee: asset,
	withdraw_permission: protocolId(WITHDRAW_PERMISSION),
	withdraw_from_account: protocolId(ACCOUNT),
	withdraw_to_account: protocolId(ACCOUNT),
	amount_to_withdraw: asset,
}); // 25

export const withdrawPermissionDelete = operation(WITHDRAW_PERMISSION_DELETE, {
	fee: asset,
	withdraw_from_account: protocolId(ACCOUNT),
	authorized_account: protocolId(ACCOUNT),
	withdrawal_permission: protocolId(WITHDRAW_PERMISSION),
}); // 26

export const committeeMemberCreate = operation(COMMITTEE_MEMBER_CREATE, {
	fee: asset,
	committee_member_account: protocolId(ACCOUNT),
	url: string,
}); // 27

export const committeeMemberUpdate = operation(COMMITTEE_MEMBER_UPDATE, {
	fee: asset,
	committee_member: protocolId(COMMITTEE_MEMBER),
	committee_member_account: protocolId(ACCOUNT),
	new_url: optional(string),
}); // 28

export const committeeMemberUpdateGlobalParameters = operation(COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS, {
	fee: asset,
	new_parameters: chainParameters,
}); // 29

export const vestingBalanceCreate = operation(VESTING_BALANCE_CREATE, {
	fee: asset,
	creator: protocolId(ACCOUNT),
	owner: protocolId(ACCOUNT),
	amount: asset,
	policy: vestingPolicyInitializer,
}); // 30

export const vestingBalanceWithdraw = operation(VESTING_BALANCE_WITHDRAW, {
	fee: asset,
	vesting_balance: protocolId(VESTING_BALANCE),
	owner: protocolId(ACCOUNT),
	amount: asset,
}); // 31

export const custom = operation(CUSTOM, {
	fee: asset,
	payer: protocolId(ACCOUNT),
	required_auths: set(protocolId(ACCOUNT)),
	id: uint16,
	data: bytes(),
}); // 32

export const assert = operation(ASSERT, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	predicates: array(predicate),
	required_auths: set(protocolId(ACCOUNT)),
	extensions: optional(empty),
}); // 33

export const balanceClaim = operation(BALANCE_CLAIM, {
	fee: asset,
	deposit_to_account: protocolId(ACCOUNT),
	balance_to_claim: protocolId(BALANCE),
	balance_owner_key: publicKey,
	total_claimed: asset,
}); // 34

export const overrideTransfer = operation(OVERRIDE_TRANSFER, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	from: protocolId(ACCOUNT),
	to: protocolId(ACCOUNT),
	amount: asset,
	extensions: optional(empty),
}); // 35

export const assetSettleCancel = operation(ASSET_SETTLE_CANCEL, {
	fee: asset,
	settlement: protocolId(FORCE_SETTLEMENT),
	account: protocolId(ACCOUNT),
	amount: asset,
	extensions: optional(empty),
}); // 36

export const assetClaimFees = operation(ASSET_CLAIM_FEES, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	amount_to_claim: asset,
	extensions: optional(empty),
}); // 37

export const bidCollateral = operation(BID_COLLATERAL, {
	fee: asset,
	bidder: protocolId(ACCOUNT),
	additional_collateral: asset,
	debt_covered: asset,
	extensions: optional(empty),
}); // 38

export const executeBid = operation(EXECUTE_BID, {
	fee: asset,
	bidder: protocolId(ACCOUNT),
	debt: asset,
	collateral: asset,
}); // 39

export const createContract = operation(CREATE_CONTRACT, {
	fee: asset,
	registrar: protocolId(ACCOUNT),
	value: asset,
	code: string,
	eth_accuracy: bool,
	supported_asset_id: optional(protocolId(ASSET)),
}); // 40

export const callContract = operation(CALL_CONTRACT, {
	fee: asset,
	registrar: protocolId(ACCOUNT),
	value: asset,
	code: string,
	callee: protocolId(CONTRACT),
}); // 41

export const contractTransfer = operation(CONTRACT_TRANSFER, {
	fee: asset,
	from: protocolId(CONTRACT),
	to: protocolId([ACCOUNT, CONTRACT]),
	amount: asset,
	extensions: optional(empty),
}); // 42

/** @type {{[operationName:string]:Operation}} */
export const operationByName = {
	transfer, // 0
	limitOrderCreate, // 1
	limitOrderCancel, // 2
	callOrderUpdate, // 3
	fillOrder, // 4
	accountCreate, // 5
	accountUpdate, // 6
	accountWhitelist, // 7
	accountUpgrade, // 8
	accountTransfer, // 9
	assetCreate, // 10
	assetUpdate, // 11
	assetUpdateBitasset, // 12
	assetUpdateFeedProducers, // 13
	assetIssue, // 14
	assetReserve, // 15
	assetFundFeePool, // 16
	assetSettle, // 17
	assetGlobalSettle, // 18
	assetPublishFeed, // 19
	proposalCreate, // 20
	proposalUpdate, // 21
	proposalDelete, // 22
	withdrawPermissionCreate, // 23
	withdrawPermissionUpdate, // 24
	withdrawPermissionClaim, // 25
	withdrawPermissionDelete, // 26
	committeeMemberCreate, // 27
	committeeMemberUpdate, // 28
	committeeMemberUpdateGlobalParameters, // 29
	vestingBalanceCreate, // 30
	vestingBalanceWithdraw, // 31
	custom, // 32
	assert, // 33
	balanceClaim, // 34
	overrideTransfer, // 35
	assetSettleCancel, // 36
	assetClaimFees, // 37
	bidCollateral, // 38
	executeBid, // 39
	createContract, // 40
	callContract, // 41
	contractTransfer, // 42
};

/** @type {Array<Operation>} */
export const allOperations = Object.values(operationByName);

/** @type {{[id:number]:Operation}} */
export const operationById = allOperations.reduce((acc, op) => {
	acc[op.id] = op;
	return acc;
}, {});

operationWrapper.types = operationById;
