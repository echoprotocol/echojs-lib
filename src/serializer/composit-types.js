import serializable from './serializable';
import {
	address,
	bytes,
	empty,
	int64,
	map,
	protocolId,
	publicKey,
	set,
	string,
	uint8,
	uint16,
	uint32,
	uint64,
	voteId,
} from './basic-types';
import { ACCOUNT, ASSET } from '../constants/object-types';

export const asset = serializable({ amount: int64, asset_id: protocolId(ASSET) });

export const memoData = serializable({
	from: publicKey,
	to: publicKey,
	nonce: uint64,
	message: bytes(undefined),
});

export const authority = serializable({
	weight_threshold: uint32,
	account_auths: map(protocolId(ACCOUNT), uint16),
	key_auths: map(publicKey, uint16),
	address_auths: map(address, uint16),
});

export const accountOptions = serializable({
	memo_key: publicKey,
	voting_account: protocolId(ACCOUNT),
	num_witness: uint16,
	num_committee: uint16,
	votes: set(voteId),
	extensions: set(empty),
});

export const price = serializable({ base: asset, quote: asset });

export const assetOptions = serializable({
	max_supply: int64,
	market_fee_percent: uint16,
	max_market_fee: int64,
	issuer_permissions: uint16,
	flags: uint16,
	core_exchange_rate: price,
	whitelist_authorities: set(protocolId(ACCOUNT)),
	blacklist_authorities: set(protocolId(ACCOUNT)),
	whitelist_markets: set(protocolId(ASSET)),
	blacklist_markets: set(protocolId(ASSET)),
	description: string,
	extensions: set(empty),
});

export const bitassetOptions = serializable({
	feed_lifetime_sec: uint32,
	minimum_feeds: uint8,
	force_settlement_delay_sec: uint32,
	force_settlement_offset_percent: uint16,
	maximum_force_settlement_volume: uint16,
	short_backing_asset: protocolId(ASSET),
	extensions: set(empty),
});

export const priceFeed = serializable({
	settlement_price: price,
	maintenance_collateral_ratio: uint16,
	maximum_short_squeeze_ratio: uint16,
	core_exchange_rate: price,
});
