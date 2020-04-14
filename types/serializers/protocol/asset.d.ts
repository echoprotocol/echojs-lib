import { StructSerializer, SetSerializer } from "../collections";
import { asset, extensions } from "../chain";
import { accountId, assetId } from "../chain/id/protocol";
import { StringSerializer } from "../basic";
import { uint8, int64, uint16, uint32 } from "../basic/integers";
import OptionalSerializer from "../collections/Optional";

export declare const priceSerializer: StructSerializer<{ base: typeof asset, quote: typeof asset }>;

export declare const assetOptionsSerializer: StructSerializer<{
	max_supply: typeof int64,
	issuer_permissions: typeof uint16,
	flags: typeof uint16,
	core_exchange_rate: typeof priceSerializer,
	whitelist_authorities: SetSerializer<typeof accountId>,
	blacklist_authorities: SetSerializer<typeof accountId>,
	description: StringSerializer,
	extensions: typeof extensions,
}>;

export declare const bitassetOptionsSerializer: StructSerializer<{
	feed_lifetime_sec: typeof uint32,
	minimum_feeds: typeof uint8,
	short_backing_asset: typeof assetId,
	extensions: typeof extensions,
}>;

export declare const assetCreateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	issuer: typeof accountId,
	symbol: StringSerializer,
	precision: typeof uint8,
	common_options: typeof assetOptionsSerializer,
	bitasset_options: OptionalSerializer<typeof bitassetOptionsSerializer>,
	extensions: typeof extensions,
}>;

export declare const assetUpdateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	issuer: typeof accountId,
	asset_to_update: typeof assetId,
	new_issuer: OptionalSerializer<typeof accountId>,
	new_options: OptionalSerializer<typeof assetOptionsSerializer>,
	extensions: typeof extensions,
}>;

export declare const assetUpdateBitassetOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	issuer: typeof accountId,
	asset_to_update: typeof assetId,
	new_options: typeof bitassetOptionsSerializer,
	extensions: typeof extensions,
}>;

export declare const assetUpdateFeedProducersOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	issuer: typeof accountId,
	asset_to_update: typeof assetId,
	new_feed_producers: SetSerializer<typeof accountId>,
	extensions: typeof extensions,
}>;

export declare const assetIssueOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	issuer: typeof accountId,
	asset_to_issue: typeof asset,
	issue_to_account: typeof accountId,
	extensions: typeof extensions,
}>;

export declare const assetReserveOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	payer: typeof accountId,
	amount_to_reserve: typeof asset,
	extensions: typeof extensions,
}>;

export declare const assetFundFeePoolOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	from_account: typeof accountId,
	asset_id: typeof assetId,
	amount: typeof int64,
	extensions: typeof extensions,
}>;

export declare const priceFeedSerializer: StructSerializer<{
	settlement_price: typeof priceSerializer,
	core_exchange_rate: typeof priceSerializer,
	maintenance_collateral_ratio: typeof uint16,
	maximum_short_squeeze_ratio: typeof uint16,
}>;

export declare const assetPublishFeedOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	publisher: typeof accountId,
	asset_id: typeof assetId,
	core_exchange_rate: typeof priceSerializer,
	extensions: typeof extensions,
}>;

export declare const assetClaimFeesOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	issuer: typeof accountId,
	amount_to_claim: typeof asset,
	extensions: typeof extensions,
}>;
