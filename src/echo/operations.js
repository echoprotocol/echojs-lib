/* eslint-disable import/prefer-default-export */
import operation from '../serializer/operation';

import {
	accountOptions,
	asset,
	assetOptions,
	authority,
	bitassetOptions,
	extensions,
	priceFeed,
	chainParameters,
	vestingPolicyInitializer,
	operationWrapper,
} from '../serializer/composit-types';

import {
	array,
	bool,
	int64,
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
	ACCOUNT_CREATE,
	ACCOUNT_UPDATE,
	ACCOUNT_WHITELIST,
	ACCOUNT_TRANSFER,
	ASSET_CREATE,
	ASSET_UPDATE,
	ASSET_UPDATE_BITASSET,
	ASSET_UPDATE_FEED_PRODUCERS,
	ASSET_ISSUE,
	ASSET_RESERVE,
	ASSET_FUND_FEE_POOL,
	ASSET_PUBLISH_FEED,
	PROPOSAL_CREATE,
	PROPOSAL_UPDATE,
	PROPOSAL_DELETE,
	COMMITTEE_MEMBER_CREATE,
	COMMITTEE_MEMBER_UPDATE,
	COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS,
	VESTING_BALANCE_CREATE,
	VESTING_BALANCE_WITHDRAW,
	BALANCE_CLAIM,
	OVERRIDE_TRANSFER,
	ASSET_CLAIM_FEES,
	CONTRACT_CREATE,
	CONTRACT_CALL,
	CONTRACT_TRANSFER,
	SIDECHAIN_CHANGE_CONFIG,
	ACCOUNT_ADDRESS_CREATE,
	TRANSFER_TO_ADDRESS,
	SIDECHAIN_ETH_CREATE_ADDRESS,
	SIDECHAIN_ETH_APPROVE_ADDRESS,
	SIDECHAIN_ETH_DEPOSIT,
	SIDECHAIN_ETH_WITHDRAW,
	SIDECHAIN_ETH_APPROVE_WITHDRAW,
	CONTRACT_FUND_POOL,
	CONTRACT_WHITELIST,
	SIDECHAIN_ETH_ISSUE,
	SIDECHAIN_ETH_BURN,
	SIDECHAIN_ERC20_REGISTER_TOKEN,
	SIDECHAIN_ERC20_WITHDRAW_TOKEN,
	SIDECHAIN_ERC20_DEPOSIT_TOKEN,
	SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW, CONTRACT_UPDATE,
} from '../constants/operations-ids';

import {
	ACCOUNT,
	ASSET,
	PROPOSAL,
	COMMITTEE_MEMBER,
	VESTING_BALANCE,
	BALANCE,
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
}); // 1

export const accountUpdate = operation(ACCOUNT_UPDATE, {
	fee: asset,
	account: protocolId(ACCOUNT),
	active: optional(authority),
	// ed_key: optional(bytes(32)),
	echorand_key: optional(publicKey),
	new_options: optional(accountOptions),
	extensions,
}); // 2

export const accountWhitelist = operation(ACCOUNT_WHITELIST, {
	fee: asset,
	authorizing_account: protocolId(ACCOUNT),
	account_to_list: protocolId(ACCOUNT),
	new_listing: uint8,
	extensions,
}); // 3

export const accountTransfer = operation(ACCOUNT_TRANSFER, {
	fee: asset,
	account_id: protocolId(ACCOUNT),
	new_owner: protocolId(ACCOUNT),
	extensions,
}); // 4

export const assetCreate = operation(ASSET_CREATE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	symbol: string,
	precision: uint8,
	common_options: assetOptions,
	bitasset_opts: optional(bitassetOptions),
	extensions,
}); // 5

export const assetUpdate = operation(ASSET_UPDATE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_issuer: optional(protocolId(ACCOUNT)),
	new_options: assetOptions,
	extensions,
}); // 6

export const assetUpdateBitasset = operation(ASSET_UPDATE_BITASSET, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_options: bitassetOptions,
	extensions,
}); // 7

export const assetUpdateFeedProducers = operation(ASSET_UPDATE_FEED_PRODUCERS, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_feed_producers: set(protocolId(ACCOUNT)),
	extensions,
}); // 8

export const assetIssue = operation(ASSET_ISSUE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_issue: asset,
	issue_to_account: protocolId(ACCOUNT),
	extensions,
}); // 9

export const assetReserve = operation(ASSET_RESERVE, {
	fee: asset,
	payer: protocolId(ACCOUNT),
	amount_to_reserve: asset,
	extensions,
}); // 10

export const assetFundFeePool = operation(ASSET_FUND_FEE_POOL, {
	fee: asset,
	from_account: protocolId(ACCOUNT),
	asset_id: protocolId(ASSET),
	amount: int64,
	extensions,
}); // 11

export const assetPublishFeed = operation(ASSET_PUBLISH_FEED, {
	fee: asset,
	publisher: protocolId(ACCOUNT),
	asset_id: protocolId(ASSET),
	feed: priceFeed,
	extensions,
}); // 12

export const proposalCreate = operation(PROPOSAL_CREATE, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	expiration_time: timePointSec,
	proposed_ops: array(operationWrapper),
	review_period_seconds: optional(uint32),
	extensions,
}); // 13

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
}); // 14

export const proposalDelete = operation(PROPOSAL_DELETE, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	using_owner_authority: bool,
	proposal: protocolId(PROPOSAL),
	extensions,
}); // 15

export const committeeMemberCreate = operation(COMMITTEE_MEMBER_CREATE, {
	fee: asset,
	committee_member_account: protocolId(ACCOUNT),
	url: string,
	extensions,
}); // 16

export const committeeMemberUpdate = operation(COMMITTEE_MEMBER_UPDATE, {
	fee: asset,
	committee_member: protocolId(COMMITTEE_MEMBER),
	committee_member_account: protocolId(ACCOUNT),
	new_url: optional(string),
	extensions,
}); // 17

export const committeeMemberUpdateGlobalParameters = operation(COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS, {
	fee: asset,
	new_parameters: chainParameters,
	extensions,
}); // 18

export const vestingBalanceCreate = operation(VESTING_BALANCE_CREATE, {
	fee: asset,
	creator: protocolId(ACCOUNT),
	owner: protocolId(ACCOUNT),
	amount: asset,
	policy: vestingPolicyInitializer,
	extensions,
}); // 19

export const vestingBalanceWithdraw = operation(VESTING_BALANCE_WITHDRAW, {
	fee: asset,
	vesting_balance: protocolId(VESTING_BALANCE),
	owner: protocolId(ACCOUNT),
	amount: asset,
	extensions,
}); // 20

export const balanceClaim = operation(BALANCE_CLAIM, {
	fee: asset,
	deposit_to_account: protocolId(ACCOUNT),
	balance_to_claim: protocolId(BALANCE),
	balance_owner_key: publicKey,
	total_claimed: asset,
	extensions,
}); // 21

export const overrideTransfer = operation(OVERRIDE_TRANSFER, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	from: protocolId(ACCOUNT),
	to: protocolId(ACCOUNT),
	amount: asset,
	extensions,
}); // 22

export const assetClaimFees = operation(ASSET_CLAIM_FEES, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	amount_to_claim: asset,
	extensions,
}); // 23

export const createContract = operation(CONTRACT_CREATE, {
	fee: asset,
	registrar: protocolId(ACCOUNT),
	value: asset,
	code: string,
	supported_asset_id: optional(protocolId(ASSET)),
	eth_accuracy: bool,
	extensions,
}); // 24

export const callContract = operation(CONTRACT_CALL, {
	fee: asset,
	registrar: protocolId(ACCOUNT),
	value: asset,
	code: string,
	callee: protocolId(CONTRACT),
	extensions,
}); // 25

export const contractTransfer = operation(CONTRACT_TRANSFER, {
	fee: asset,
	from: protocolId(CONTRACT),
	to: protocolId([ACCOUNT, CONTRACT]),
	amount: asset,
	extensions,
}); // 26

export const changeSidechainConfig = operation(SIDECHAIN_CHANGE_CONFIG, {
	fee: asset,
	from: protocolId(CONTRACT),
	amount: asset,
	extensions,
}); // 27

export const accountAddressCreate = operation(ACCOUNT_ADDRESS_CREATE, {
	fee: asset,
	owner: protocolId(ACCOUNT),
	label: string,
	extensions,
}); // 28

export const transferToAddress = operation(TRANSFER_TO_ADDRESS, {
	fee: asset,
	from: protocolId(ACCOUNT),
	to: string,
	amount: asset,
	extensions,
}); // 29

export const generateEthAddress = operation(SIDECHAIN_ETH_CREATE_ADDRESS, {
	fee: asset,
	account: protocolId(ACCOUNT),
	extensions,
}); // 30

export const createEthAddress = operation(SIDECHAIN_ETH_APPROVE_ADDRESS, {
	fee: asset,
	account: protocolId(ACCOUNT),
	committee_member_id: protocolId(COMMITTEE_MEMBER),
	extensions,
}); // 31

export const depositEth = operation(SIDECHAIN_ETH_DEPOSIT, {
	fee: asset,
	committee_member_id: protocolId(COMMITTEE_MEMBER),
	from: protocolId(ACCOUNT),
	amount: asset,
}); // 32

export const withdrawEth = operation(SIDECHAIN_ETH_WITHDRAW, {
	fee: asset,
	account: protocolId(ACCOUNT),
	eth_addr: string,
	value: uint64,
	extensions,
}); // 33

export const approveWithdrawEth = operation(SIDECHAIN_ETH_APPROVE_WITHDRAW, {
	fee: asset,
	committee_member_id: protocolId(COMMITTEE_MEMBER),
	extensions,
}); // 34

export const contractFundPool = operation(CONTRACT_FUND_POOL, {
	fee: asset,
	sender: protocolId(ACCOUNT),
	contract: protocolId(CONTRACT),
	amount: asset,
	extensions,
}); // 35

export const contractWhitelist = operation(CONTRACT_WHITELIST, {
	fee: asset,
	sender: protocolId(ACCOUNT),
	contract: protocolId(CONTRACT),
	extensions,
}); // 36

export const sidechainIssue = operation(SIDECHAIN_ETH_ISSUE, {
	fee: asset,
	amount: asset,
	account: protocolId(ACCOUNT),
	deposit_id: protocolId(SIDECHAIN_ETH_DEPOSIT),
	extensions,
}); // 37

export const sidechainBurn = operation(SIDECHAIN_ETH_BURN, {
	fee: asset,
	amount: asset,
	account: protocolId(ACCOUNT),
	withdraw_id: protocolId(SIDECHAIN_ETH_DEPOSIT),
	extensions,
}); // 38

export const registerErc20Token = operation(SIDECHAIN_ERC20_REGISTER_TOKEN, {
	fee: asset,
	account: protocolId(ACCOUNT),
	eth_addr: protocolId(ETH_ADDRESS),
	extensions,
}); // 39

export const depositErc20Token = operation(SIDECHAIN_ERC20_DEPOSIT_TOKEN, {
	fee: asset,
	committee_member_id: protocolId(ACCOUNT),
	erc20_token_addr: protocolId(ETH_ADDRESS),
	transaction_hash: uint32,
	extensions,
}); // 40

export const withdrawErc20Token = operation(SIDECHAIN_ERC20_WITHDRAW_TOKEN, {
	fee: asset,
	account: protocolId(ACCOUNT),
	to: protocolId(ETH_ADDRESS),
	erc20_token: protocolId(ERC20_TOKEN),
	extensions,
}); // 41

export const approveErc20TokenWithdraw = operation(SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW, {
	fee: asset,
	committee_member_id: protocolId(ACCOUNT),
	to: protocolId(ETH_ADDRESS),
	transaction_hash: uint32,
	extensions,
}); // 42

export const contractUpdate = operation(CONTRACT_UPDATE, {
	fee: asset,
	sender: protocolId(ACCOUNT),
	contract: protocolId(CONTRACT),
	extensions,
}); // 43

/** @type {{[operationName:string]:Operation}} */
export const operationByName = {
	transfer, // 0
	accountCreate, // 1
	accountUpdate, // 2
	accountWhitelist, // 3
	accountTransfer, // 4
	assetCreate, // 5
	assetUpdate, // 6
	assetUpdateBitasset, // 7
	assetUpdateFeedProducers, // 8
	assetIssue, // 9
	assetReserve, // 10
	assetFundFeePool, // 11
	assetPublishFeed, // 12
	proposalCreate, // 13
	proposalUpdate, // 14
	proposalDelete, // 15
	committeeMemberCreate, // 16
	committeeMemberUpdate, // 17
	committeeMemberUpdateGlobalParameters, // 18
	vestingBalanceCreate, // 19
	vestingBalanceWithdraw, // 20
	balanceClaim, // 21
	overrideTransfer, // 22
	assetClaimFees, // 23
	createContract, // 24
	callContract, // 25
	contractTransfer, // 26
	changeSidechainConfig, // 27
	accountAddressCreate, // 28
	transferToAddress, // 29
	generateEthAddress, // 30
	createEthAddress, // 31
	depositEth, // 32
	withdrawEth, // 33
	approveWithdrawEth, // 34
	contractFundPool, // 35,
	contractWhitelist, // 36,
	sidechainIssue, // 37,
	sidechainBurn, // 38,
	registerErc20Token, // 39,
	depositErc20Token, // 40,
	withdrawErc20Token, // 41,
	approveErc20TokenWithdraw, // 42,
	contractUpdate, // 43,
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
