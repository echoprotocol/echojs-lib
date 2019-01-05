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
} from '../serializer/composit-types';

import {
	array,
	bool,
	empty,
	int64,
	objectId,
	optional,
	protocolId,
	set,
	string,
	timePointSec,
	uint8,
	uint16,
	publicKey,
	staticVariant,
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
} from '../constants/operations-ids';

import { ACCOUNT, LIMIT_ORDER, ASSET, WITNESS } from '../constants/object-types';

/** @typedef {import('../serializer/operation').Operation} Operation */

export const transfer = operation(TRANSFER, {
	fee: asset,
	from: protocolId(ACCOUNT),
	to: protocolId(ACCOUNT),
	amount: asset,
	memo: optional(memoData),
	extensions: set(empty),
});

export const limitOrderCreate = operation(LIMIT_ORDER_CREATE, {
	fee: asset,
	seller: protocolId(ACCOUNT),
	amount_to_sell: asset,
	min_to_receive: asset,
	expiration: timePointSec,
	fill_or_kill: bool,
	extensions: set(empty),
});

export const limitOrderCancel = operation(LIMIT_ORDER_CANCEL, {
	fee: asset,
	fee_paying_account: protocolId(ACCOUNT),
	order: protocolId(LIMIT_ORDER),
	extensions: set(empty),
});

export const callOrderUpdate = operation(CALL_ORDER_UPDATE, {
	fee: asset,
	funding_account: protocolId(ACCOUNT),
	delta_collateral: asset,
	delta_debt: asset,
	extensions: set(empty),
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
	options: accountOptions,
	extensions: set(empty),
});

export const accountUpdate = operation(ACCOUNT_UPDATE, {
	fee: asset,
	account: protocolId(ACCOUNT),
	owner: optional(authority),
	active: optional(authority),
	new_options: optional(accountOptions),
	extensions: set(empty),
});

export const accountWhitelist = operation(ACCOUNT_WHITELIST, {
	fee: asset,
	authorizing_account: protocolId(ACCOUNT),
	account_to_list: protocolId(ACCOUNT),
	new_listing: uint8,
	extensions: set(empty),
});

export const accountUpgrade = operation(ACCOUNT_UPGRADE, {
	fee: asset,
	account_to_upgrade: protocolId(ACCOUNT),
	upgrade_to_lifetime_member: bool,
	extensions: set(empty),
});

export const accountTransfer = operation(ACCOUNT_TRANSFER, {
	fee: asset,
	account_id: protocolId(ACCOUNT),
	new_owner: protocolId(ACCOUNT),
	extensions: set(empty),
});

export const assetCreate = operation(ASSET_CREATE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	symbol: string,
	precision: uint8,
	common_options: assetOptions,
	bitasset_opts: optional(bitassetOptions),
	is_prediction_market: bool,
	extensions: set(empty),
});

export const assetUpdate = operation(ASSET_UPDATE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_issuer: optional(protocolId(ACCOUNT)),
	new_options: assetOptions,
	extensions: set(empty),
});

export const assetUpdateBitasset = operation(ASSET_UPDATE_BITASSET, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_options: bitassetOptions,
	extensions: set(empty),
});

export const assetUpdateFeedProducers = operation(ASSET_UPDATE_FEED_PRODUCERS, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_update: protocolId(ASSET),
	new_feed_producers: set(protocolId(ACCOUNT)),
	extensions: set(empty),
});

export const assetIssue = operation(ASSET_ISSUE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_issue: asset,
	issue_to_account: protocolId(ACCOUNT),
	memo: optional(memoData),
	extensions: set(empty),
});

export const assetReserve = operation(ASSET_RESERVE, {
	fee: asset,
	payer: protocolId(ACCOUNT),
	amount_to_reserve: asset,
	extensions: set(empty),
});

export const assetFundFeePool = operation(ASSET_FUND_FEE_POOL, {
	fee: asset,
	from_account: protocolId(ACCOUNT),
	asset_id: protocolId(ASSET),
	amount: int64,
	extensions: set(empty),
});

export const assetSettle = operation(ASSET_SETTLE, {
	fee: asset,
	account: protocolId(ACCOUNT),
	amount: asset,
	extensions: set(empty),
});

export const assetGlobalSettle = operation(ASSET_GLOBAL_SETTLE, {
	fee: asset,
	issuer: protocolId(ACCOUNT),
	asset_to_settle: protocolId(ASSET),
	settle_price: price,
	extensions: set(empty),
});

export const assetPublishFeed = operation(ASSET_PUBLISH_FEED, {
	fee: asset,
	publisher: protocolId(ACCOUNT),
	asset_id: protocolId(ASSET),
	feed: priceFeed,
	extensions: set(empty),
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
	fee_paying_account: protocolId('account'),
	expiration_time: timePointSec,
	proposed_ops: array(staticVariant),
	review_period_seconds: optional(uint32),
	extensions: set(futureExtensions)
});

/** @type {{[operationName:string]:Operation}} */
const operations = {
	transfer,
};

for (const operationName in operations) {
	if (!Object.prototype.hasOwnProperty.call(operations, operationName)) continue;
	const operationType = operations[operationName];
	operations[operationType.id] = operationType;
}

export default operations;
