import staticVariant from './basic-types/static-variant';
import feeTypes from './fee-types';
import serializable from './serializable';
import { ACCOUNT, ASSET } from '../constants/object-types';

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
	bool,
	optional,
} from './basic-types';

export { default as predicate } from './predicate';
export { default as vestingPolicyInitializer } from './vesting-policy';
export { default as workerInitializer } from './worker';

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

export const feeSchedule = serializable({
	parameters: set(staticVariant(feeTypes)),
	scale: uint32,
});

export const chainParameters = serializable({
	current_fees: feeSchedule,
	block_interval: uint8,
	maintenance_interval: uint32,
	maintenance_skip_slots: uint8,
	committee_proposal_review_period: uint32,
	maximum_transaction_size: uint32,
	maximum_block_size: uint32,
	maximum_time_until_expiration: uint32,
	maximum_proposal_lifetime: uint32,
	maximum_asset_whitelist_authorities: uint8,
	maximum_asset_feed_publishers: uint8,
	maximum_witness_count: uint16,
	maximum_committee_count: uint16,
	maximum_authority_membership: uint16,
	reserve_percent_of_fee: uint16,
	network_percent_of_fee: uint16,
	lifetime_referrer_percent_of_fee: uint16,
	cashback_vesting_period_seconds: uint32,
	cashback_vesting_threshold: int64,
	count_non_member_votes: bool,
	allow_non_member_whitelists: bool,
	witness_pay_per_block: int64,
	worker_budget_per_day: int64,
	max_predicate_opcode: uint16,
	fee_liquidation_threshold: int64,
	accounts_per_fee_scale: uint16,
	account_fee_scale_bitshifts: uint8,
	max_authority_depth: uint8,
	extensions: set(empty),
});

export const blindOutput = serializable({
	commitment: bytes(33),
	range_proof: bytes(),
	owner: authority,
	stealth_memo: optional(serializable({
		one_time_key: publicKey,
		to: optional(publicKey),
		encrypted_memo: bytes(),
	})),
});

export const blindInput = serializable({
	commitment: bytes(33),
	owner: authority,
});
