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
	new_options: typeof assetOptionsSerializer,
	extensions: typeof extensions,
}>;

export declare const assetUpdateBitassetPropsSerializer: StructSerializer<{
	fee: typeof asset,
	issuer: typeof accountId,
	asset_to_update: typeof assetId,
	new_options: typeof bitassetOptionsSerializer,
	extensions: typeof extensions,
}>;
