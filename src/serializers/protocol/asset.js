import { struct, set, optional } from '../collections';
import { asset, extensions } from '../chain';
import { accountId, assetId } from '../chain/id/protocol';
import { string as stringSerializer } from '../basic';
import { uint8, int64, uint16, uint32 } from '../basic/integers';

export const priceSerializer = struct({ base: asset, quote: asset });

export const assetOptionsSerializer = struct({
	max_supply: int64,
	issuer_permissions: uint16,
	flags: uint16,
	core_exchange_rate: priceSerializer,
	whitelist_authorities: set(accountId),
	blacklist_authorities: set(accountId),
	description: stringSerializer,
	extensions,
});

export const bitassetOptionsSerializer = struct({
	feed_lifetime_sec: uint32,
	minimum_feeds: uint8,
	short_backing_asset: assetId,
	extensions,
});

export const assetCreateOperationPropsSerializer = struct({
	fee: asset,
	issuer: accountId,
	symbol: stringSerializer,
	precision: uint8,
	common_options: assetOptionsSerializer,
	bitasset_options: optional(bitassetOptionsSerializer),
	extensions,
});

export const assetUpdateOperationPropsSerializer = struct({
	fee: asset,
	issuer: accountId,
	asset_to_update: assetId,
	new_issuer: optional(accountId),
	new_options: optional(assetOptionsSerializer),
	extensions,
});

export const assetUpdateBitassetOperationPropsSerializer = struct({
	fee: asset,
	issuer: accountId,
	asset_to_update: assetId,
	new_options: bitassetOptionsSerializer,
	extensions,
});

export const assetUpdateFeedProducersOperationPropsSerializer = struct({
	fee: asset,
	issuer: accountId,
	asset_to_update: assetId,
	new_feed_producers: set(accountId),
	extensions,
});

export const assetIssueOperationPropsSerializer = struct({
	fee: asset,
	issuer: accountId,
	asset_to_issue: asset,
	issue_to_account: accountId,
	extensions,
});

export const assetReserveOperationPropsSerializer = struct({
	fee: asset,
	payer: accountId,
	amount_to_reserve: asset,
	extensions,
});

export const assetFundFeePoolOperationPropsSerializer = struct({
	fee: asset,
	from_account: accountId,
	asset_id: assetId,
	amount: int64,
	extensions,
});

export const priceFeedSerializer = struct({
	settlement_price: priceSerializer,
	core_exchange_rate: priceSerializer,
	maintenance_collateral_ratio: uint16,
	maximum_short_squeeze_ratio: uint16,
});

export const assetPublishFeedOperationPropsSerializer = struct({
	fee: asset,
	publisher: accountId,
	asset_id: assetId,
	core_exchange_rate: priceSerializer,
	extensions,
});

export const assetClaimFeesOperationPropsSerializer = struct({
	fee: asset,
	issuer: accountId,
	amount_to_claim: asset,
	extensions,
});
