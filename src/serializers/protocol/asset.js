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
