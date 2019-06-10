import staticVariant from './basic-types/static-variant';
import feeTypes from './fee-types';
import serializable from './serializable';
import { ACCOUNT, ASSET, CONTRACT } from '../constants/object-types';

import {
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
} from './basic-types';

export { default as predicate } from './predicate';
export { default as vestingPolicyInitializer } from './vesting-policy';

export const operationWrapper = staticVariant({});
export const asset = serializable({ amount: int64, asset_id: protocolId(ASSET) });
export const price = serializable({ base: asset, quote: asset });

export const authority = serializable({
	weight_threshold: uint32,
	account_auths: map(protocolId(ACCOUNT), uint16),
	key_auths: map(publicKey, uint16),
});

export const accountOptions = serializable({
	voting_account: protocolId(ACCOUNT),
	delegating_account: protocolId(ACCOUNT),
	num_committee: uint16,
	votes: set(voteId),
	extensions: set(empty),
});

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

export const echorandConfig = serializable({
	_time_net_1mb: uint32,
	_time_net_256b: uint32,
	_creator_count: uint32,
	_verifier_count: uint32,
	_ok_threshold: uint32,
	_max_bba_steps: uint32,
	_gc1_delay: uint32,
});

export const sidechainConfig = serializable({
	echo_contract_id: protocolId(CONTRACT),
	echo_vote_method: string,
	echo_sign_method: string,
	echo_transfer_topic: string,
	echo_transfer_ready_topic: string,
	eth_contract_address: string,
	eth_committee_method: string,
	eth_transfer_topic: string,
});

export const gasPrice = serializable({
	price: uint64,
	gas_amount: uint64,
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
	maximum_committee_count: uint16,
	maximum_authority_membership: uint16,
	reserve_percent_of_fee: uint16,
	network_percent_of_fee: uint16,
	lifetime_referrer_percent_of_fee: uint16,
	cashback_vesting_period_seconds: uint32,
	cashback_vesting_threshold: int64,
	count_non_member_votes: bool,
	allow_non_member_whitelists: bool,
	max_predicate_opcode: uint16,
	fee_liquidation_threshold: int64,
	accounts_per_fee_scale: uint16,
	account_fee_scale_bitshifts: uint8,
	max_authority_depth: uint8,
	echorand_config: echorandConfig,
	sidechain_config: sidechainConfig,
	gas_price: gasPrice,
	extensions: set(empty),
});
