/* eslint-disable import/prefer-default-export */
import operation from '../serializer/operation';

import {
	accountOptions,
	asset,
	assetOptions,
	authority,
	bitassetOptions,
	extensions,
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
	uint32, uint64,
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
	CHANGE_SIDECHAIN_CONFIG,
	ACCOUNT_ADDRESS_CREATE,
	TRANSFER_TO_ADDRESS,
	GENERATE_ETH_ADDRESS,
	CREATE_ETH_ADDRESS,
	DEPOSIT_ETH,
	WITHDRAW_ETH,
	APPROVE_WITHDRAW_ETH,
	CONTRACT_FUND_POOL,
	CONTRACT_WHITELIST,
	SIDECHAIN_ISSUE,
	SIDECHAIN_BURN,
	REGISTER_ERC20_TOKEN,
	WITHDRAW_ERC20_TOKEN,
	DEPOSIT_ERC20_TOKEN,
	APPROVE_ERC20_TOKEN_WITHDRAW, CONTRACT_UPDATE,
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
	CONTRACT, ERC20_TOKEN, ETH_ADDRESS,
} from '../constants/object-types';

/** @typedef {import('../serializer/operation').Operation} Operation */

export const transfer = operation(TRANSFER, {
	fee: asset,
	from: protocolId(ACCOUNT),
	to: protocolId(ACCOUNT),
	amount: asset,
	extensions,
}); // 0

export const limitOrderCreate = operation(LIMIT_ORDER_CREATE, {
	fee: asset,
	seller: protocolId(ACCOUNT),
	amount_to_sell: asset,
	min_to_receive: asset,
	expiration: timePointSec,
	fill_or_kill: bool,
	extensions,
}); // 1

export const limitOrderCancel = operation(LIMIT_ORDER_CANCEL, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	order: protocolId(LIMIT_ORDER),
	extensions,
}); // 2

export const callOrderUpdate = operation(CALL_ORDER_UPDATE, {
	fee: asset,
	funding_account: protocolId(ACCOUNT),
	delta_collateral: asset,
	delta_debt: asset,
	extensions,
}); // 3

export const fillOrder = operation(FILL_ORDER, {
	fee: asset,
	order_id: objectId,
	account_id: protocolId(ACCOUNT),
	pays: asset,
	receives: asset,
	extensions,
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
	extensions,
}); // 5

export const accountUpdate = operation(ACCOUNT_UPDATE, {
	fee: asset,
	account: protocolId(ACCOUNT),
	active: optional(authority),
	// ed_key: optional(bytes(32)),
	echorand_key: optional(publicKey),
	new_options: optional(accountOptions),
	extensions,
}); // 6

export const accountWhitelist = operation(ACCOUNT_WHITELIST, {
	fee: asset,
	authorizing_account: protocolId(ACCOUNT),
	account_to_list: protocolId(ACCOUNT),
	new_listing: uint8,
	extensions,
}); // 7

export const accountUpgrade = operation(ACCOUNT_UPGRADE, {
	fee: asset,
	account_to_upgrade: protocolId(ACCOUNT),
	upgrade_to_lifetime_member: bool,
	extensions,
}); // 8

export const accountTransfer = operation(ACCOUNT_TRANSFER, {
	fee: asset,
	account_id: protocolId(ACCOUNT),
	new_owner: protocolId(ACCOUNT),
	extensions,
}); // 9

export const assetCreate = operation(ASSET_CREATE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	symbol: string,
	precision: uint8,
	common_options: assetOptions,
	bitasset_opts: optional(bitassetOptions),
	is_prediction_market: bool,
	extensions,
}); // 10

export const assetUpdate = operation(ASSET_UPDATE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_issuer: optional(protocolId(ACCOUNT)),
	new_options: assetOptions,
	extensions,
}); // 11

export const assetUpdateBitasset = operation(ASSET_UPDATE_BITASSET, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_options: bitassetOptions,
	extensions,
}); // 12

export const assetUpdateFeedProducers = operation(ASSET_UPDATE_FEED_PRODUCERS, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_feed_producers: set(protocolId(ACCOUNT)),
	extensions,
}); // 13

export const assetIssue = operation(ASSET_ISSUE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_issue: asset,
	issue_to_account: protocolId(ACCOUNT),
	extensions,
}); // 14

export const assetReserve = operation(ASSET_RESERVE, {
	fee: asset,
	payer: protocolId(ACCOUNT),
	amount_to_reserve: asset,
	extensions,
}); // 15

export const assetFundFeePool = operation(ASSET_FUND_FEE_POOL, {
	fee: asset,
	from_account: protocolId(ACCOUNT),
	asset_id: protocolId(ASSET),
	amount: int64,
	extensions,
}); // 16

export const assetSettle = operation(ASSET_SETTLE, {
	fee: asset,
	account: protocolId(ACCOUNT),
	amount: asset,
	extensions,
}); // 17

export const assetGlobalSettle = operation(ASSET_GLOBAL_SETTLE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_settle: protocolId(ASSET),
	settle_price: price,
	extensions,
}); // 18

export const assetPublishFeed = operation(ASSET_PUBLISH_FEED, {
	fee: asset,
	publisher: protocolId(ACCOUNT),
	asset_id: protocolId(ASSET),
	feed: priceFeed,
	extensions,
}); // 19

export const proposalCreate = operation(PROPOSAL_CREATE, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	expiration_time: timePointSec,
	proposed_ops: array(operationWrapper),
	review_period_seconds: optional(uint32),
	extensions,
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
	extensions,
}); // 21

export const proposalDelete = operation(PROPOSAL_DELETE, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	using_owner_authority: bool,
	proposal: protocolId(PROPOSAL),
	extensions,
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
	extensions,
}); // 25

export const withdrawPermissionDelete = operation(WITHDRAW_PERMISSION_DELETE, {
	fee: asset,
	withdraw_from_account: protocolId(ACCOUNT),
	authorized_account: protocolId(ACCOUNT),
	withdrawal_permission: protocolId(WITHDRAW_PERMISSION),
	extensions,
}); // 26

export const committeeMemberCreate = operation(COMMITTEE_MEMBER_CREATE, {
	fee: asset,
	committee_member_account: protocolId(ACCOUNT),
	url: string,
	extensions,
}); // 27

export const committeeMemberUpdate = operation(COMMITTEE_MEMBER_UPDATE, {
	fee: asset,
	committee_member: protocolId(COMMITTEE_MEMBER),
	committee_member_account: protocolId(ACCOUNT),
	new_url: optional(string),
	extensions,
}); // 28

export const committeeMemberUpdateGlobalParameters = operation(COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS, {
	fee: asset,
	new_parameters: chainParameters,
	extensions,
}); // 29

export const vestingBalanceCreate = operation(VESTING_BALANCE_CREATE, {
	fee: asset,
	creator: protocolId(ACCOUNT),
	owner: protocolId(ACCOUNT),
	amount: asset,
	policy: vestingPolicyInitializer,
	extensions,
}); // 30

export const vestingBalanceWithdraw = operation(VESTING_BALANCE_WITHDRAW, {
	fee: asset,
	vesting_balance: protocolId(VESTING_BALANCE),
	owner: protocolId(ACCOUNT),
	amount: asset,
	extensions,
}); // 31

export const custom = operation(CUSTOM, {
	fee: asset,
	payer: protocolId(ACCOUNT),
	required_auths: set(protocolId(ACCOUNT)),
	id: uint16,
	data: bytes(),
	extensions,
}); // 32

export const assert = operation(ASSERT, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	predicates: array(predicate),
	required_auths: set(protocolId(ACCOUNT)),
	extensions,
}); // 33

export const balanceClaim = operation(BALANCE_CLAIM, {
	fee: asset,
	deposit_to_account: protocolId(ACCOUNT),
	balance_to_claim: protocolId(BALANCE),
	balance_owner_key: publicKey,
	total_claimed: asset,
	extensions,
}); // 34

export const overrideTransfer = operation(OVERRIDE_TRANSFER, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	from: protocolId(ACCOUNT),
	to: protocolId(ACCOUNT),
	amount: asset,
	extensions,
}); // 35

export const assetSettleCancel = operation(ASSET_SETTLE_CANCEL, {
	fee: asset,
	settlement: protocolId(FORCE_SETTLEMENT),
	account: protocolId(ACCOUNT),
	amount: asset,
	extensions,
}); // 36

export const assetClaimFees = operation(ASSET_CLAIM_FEES, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	amount_to_claim: asset,
	extensions,
}); // 37

export const bidCollateral = operation(BID_COLLATERAL, {
	fee: asset,
	bidder: protocolId(ACCOUNT),
	additional_collateral: asset,
	debt_covered: asset,
	extensions,
}); // 38

export const executeBid = operation(EXECUTE_BID, {
	fee: asset,
	bidder: protocolId(ACCOUNT),
	debt: asset,
	collateral: asset,
	extensions,
}); // 39

export const createContract = operation(CREATE_CONTRACT, {
	fee: asset,
	registrar: protocolId(ACCOUNT),
	value: asset,
	code: string,
	supported_asset_id: optional(protocolId(ASSET)),
	eth_accuracy: bool,
	extensions,
}); // 40

export const callContract = operation(CALL_CONTRACT, {
	fee: asset,
	registrar: protocolId(ACCOUNT),
	value: asset,
	code: string,
	callee: protocolId(CONTRACT),
	extensions,
}); // 41

export const contractTransfer = operation(CONTRACT_TRANSFER, {
	fee: asset,
	from: protocolId(CONTRACT),
	to: protocolId([ACCOUNT, CONTRACT]),
	amount: asset,
	extensions,
}); // 42

export const changeSidechainConfig = operation(CHANGE_SIDECHAIN_CONFIG, {
	fee: asset,
	from: protocolId(CONTRACT),
	amount: asset,
	extensions,
}); // 43

export const accountAddressCreate = operation(ACCOUNT_ADDRESS_CREATE, {
	fee: asset,
	owner: protocolId(ACCOUNT),
	label: string,
	extensions,
}); // 44

export const transferToAddress = operation(TRANSFER_TO_ADDRESS, {
	fee: asset,
	from: protocolId(ACCOUNT),
	to: string,
	amount: asset,
	extensions,
}); // 45

export const generateEthAddress = operation(GENERATE_ETH_ADDRESS, {
	fee: asset,
	account: protocolId(ACCOUNT),
	extensions,
}); // 46

export const createEthAddress = operation(CREATE_ETH_ADDRESS, {
	fee: asset,
	account: protocolId(ACCOUNT),
	committee_member_id: protocolId(COMMITTEE_MEMBER),
	extensions,
}); // 47

export const depositEth = operation(DEPOSIT_ETH, {
	fee: asset,
	committee_member_id: protocolId(COMMITTEE_MEMBER),
	from: protocolId(ACCOUNT),
	amount: asset,
}); // 48

export const withdrawEth = operation(WITHDRAW_ETH, {
	fee: asset,
	account: protocolId(ACCOUNT),
	eth_addr: string,
	value: uint64,
	extensions,
}); // 49

export const approveWithdrawEth = operation(APPROVE_WITHDRAW_ETH, {
	fee: asset,
	committee_member_id: protocolId(COMMITTEE_MEMBER),
	extensions,
}); // 50

export const contractFundPool = operation(CONTRACT_FUND_POOL, {
	fee: asset,
	sender: protocolId(ACCOUNT),
	contract: protocolId(CONTRACT),
	amount: asset,
	extensions,
}); // 51

export const contractWhitelist = operation(CONTRACT_WHITELIST, {
	fee: asset,
	sender: protocolId(ACCOUNT),
	contract: protocolId(CONTRACT),
	extensions,
}); // 52

export const sidechainIssue = operation(SIDECHAIN_ISSUE, {
	fee: asset,
	amount: asset,
	account: protocolId(ACCOUNT),
	deposit_id: protocolId(DEPOSIT_ETH),
	extensions,
}); // 53

export const sidechainBurn = operation(SIDECHAIN_BURN, {
	fee: asset,
	amount: asset,
	account: protocolId(ACCOUNT),
	withdraw_id: protocolId(DEPOSIT_ETH),
	extensions,
}); // 54

export const registerErc20Token = operation(REGISTER_ERC20_TOKEN, {
	fee: asset,
	account: protocolId(ACCOUNT),
	eth_addr: protocolId(ETH_ADDRESS),
	extensions,
}); // 55

export const depositErc20Token = operation(DEPOSIT_ERC20_TOKEN, {
	fee: asset,
	committee_member_id: protocolId(ACCOUNT),
	erc20_token_addr: protocolId(ETH_ADDRESS),
	transaction_hash: uint32,
	extensions,
}); // 56

export const withdrawErc20Token = operation(WITHDRAW_ERC20_TOKEN, {
	fee: asset,
	account: protocolId(ACCOUNT),
	to: protocolId(ETH_ADDRESS),
	erc20_token: protocolId(ERC20_TOKEN),
	extensions,
}); // 57

export const approveErc20TokenWithdraw = operation(APPROVE_ERC20_TOKEN_WITHDRAW, {
	fee: asset,
	committee_member_id: protocolId(ACCOUNT),
	to: protocolId(ETH_ADDRESS),
	transaction_hash: uint32,
	extensions,
}); // 58

export const contractUpdate = operation(CONTRACT_UPDATE, {
	fee: asset,
	sender: protocolId(ACCOUNT),
	contract: protocolId(CONTRACT),
	extensions,
}); // 59

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
	changeSidechainConfig, // 43
	accountAddressCreate, // 44
	transferToAddress, // 45
	generateEthAddress, // 46
	createEthAddress, // 47
	depositEth, // 48
	withdrawEth, // 49
	approveWithdrawEth, // 50
	contractFundPool, // 51,
	contractWhitelist, // 52,
	sidechainIssue, // 53,
	sidechainBurn, // 54,
	registerErc20Token, // 55,
	depositErc20Token, // 56,
	withdrawErc20Token, // 57,
	approveErc20TokenWithdraw, // 58,
	contractUpdate, // 59,
};

/** @type {Array<Operation>} */
export const allOperations = Object.values(operationByName);

/** @type {{[id:number]:Operation}} */
export const operationById = allOperations.reduce((acc, op) => {
	acc[op.id] = op;
	return acc;
}, {});

export const operationSerializerById = allOperations.reduce((acc, op) => {
	acc[op.id] = op.serializable;
	return acc;
}, {});

operationWrapper.types = operationSerializerById;
