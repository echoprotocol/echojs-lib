import * as basic_type from "./basic-types";
import fee_parameters from "./fee-types";
import serialization, { serialization_input, serialization_output } from "./serialization";
import OperationId from "../OperationId";

export type extensions<T extends serialization> = T extends serialization_input ? [] | undefined : [];

export interface account_options<T extends serialization> {
	voting_account: basic_type.account_id,
	delegating_account: basic_type.account_id,
	num_committee: basic_type.uint16<T>,
	votes: basic_type.set<basic_type.vote_id<T>>,
	extensions: extensions<T>,
}

export interface asset<T extends serialization> {
	amount: basic_type.int64<T>,
	asset_id: basic_type.asset_id,
}

export interface asset_options<T extends serialization> {
	max_supply: basic_type.int64<T>,
	market_fee_percent: basic_type.uint16<T>,
	max_market_fee: basic_type.int64<T>,
	issuer_permissions: basic_type.uint16<T>,
	flags: basic_type.uint16<T>,
	core_exchange_rate: price<T>,
	whitelist_authorities: basic_type.set<basic_type.account_id>,
	blacklist_authorities: basic_type.set<basic_type.account_id>,
	whitelist_markets: basic_type.set<basic_type.asset_id>,
	blacklist_markets: basic_type.set<basic_type.asset_id>,
	description: string,
	extensions: extensions<T>,
}

export interface authority<T extends serialization> {
	weight_threshold: basic_type.uint32<T>,
	account_auths: basic_type.map<basic_type.account_id, basic_type.uint16<T>>,
	key_auths: basic_type.map<basic_type.public_key<T>, basic_type.uint16<T>>,
}

export interface bitasset_options<T extends serialization> {
	feed_lifetime_sec: basic_type.uint32<T>,
	minimum_feeds: basic_type.uint8<T>,
	force_settlement_delay_sec: basic_type.uint32<T>,
	force_settlement_offset_percent: basic_type.uint16<T>,
	maximum_force_settlement_volume: basic_type.uint16<T>,
	short_backing_asset: basic_type.asset_id,
	extensions: extensions<T>,
}

export interface chain_parameters<T extends serialization> {
	current_fees: fee_schedule<T>,
	block_interval: basic_type.uint8<T>,
	maintenance_interval: basic_type.uint32<T>,
	maintenance_skip_slots: basic_type.uint8<T>,
	committee_proposal_review_period: basic_type.uint32<T>,
	maximum_transaction_size: basic_type.uint32<T>,
	maximum_block_size: basic_type.uint32<T>,
	maximum_time_until_expiration: basic_type.uint32<T>,
	maximum_proposal_lifetime: basic_type.uint32<T>,
	maximum_asset_whitelist_authorities: basic_type.uint8<T>,
	maximum_asset_feed_publishers: basic_type.uint8<T>,
	maximum_committee_count: basic_type.uint16<T>,
	maximum_authority_membership: basic_type.uint16<T>,
	reserve_percent_of_fee: basic_type.uint16<T>,
	network_percent_of_fee: basic_type.uint16<T>,
	lifetime_referrer_percent_of_fee: basic_type.uint16<T>,
	cashback_vesting_period_seconds: basic_type.uint32<T>,
	cashback_vesting_threshold: basic_type.int64<T>,
	count_non_member_votes: basic_type.bool,
	allow_non_member_whitelists: basic_type.bool,
	max_predicate_opcode: basic_type.uint16<T>,
	fee_liquidation_threshold: basic_type.int64<T>,
	accounts_per_fee_scale: basic_type.uint16<T>,
	account_fee_scale_bitshifts: basic_type.uint8<T>,
	max_authority_depth: basic_type.uint8<T>,
	echorand_config: echorand_config<T>,
	sidechain_config: sidechain_config,
	gas_price: gas_price<T>,
	extensions: extensions<T>,
}

export interface echorand_config<T extends serialization> {
	_time_net_1mb: basic_type.uint32<T>,
	_time_net_256b: basic_type.uint32<T>,
	_creator_count: basic_type.uint32<T>,
	_verifier_count: basic_type.uint32<T>,
	_ok_threshold: basic_type.uint32<T>,
	_max_bba_steps: basic_type.uint32<T>,
	_gc1_delay: basic_type.uint32<T>,
}

export interface fee_schedule<T extends serialization> {
	parameters: basic_type.set<fee_parameters<OperationId, T>>,
	scale: basic_type.uint32<T>,
}

export interface gas_price<T extends serialization> {
	price: basic_type.uint64<T>,
	gas_amount: basic_type.uint64<T>,
}

export interface price<T extends serialization> {
	base: asset<T>,
	quote: asset<T>,
}

export interface price_feed<T extends serialization> {
	settlement_price: price<T>,
	maintenance_collateral_ratio: basic_type.uint16<T>,
	maximum_short_squeeze_ratio: basic_type.uint16<T>,
	core_exchange_rate: price<T>,
}

export interface sidechain_config {
	echo_contract_id: basic_type.contract_id,
	echo_vote_method: string,
	echo_sign_method: string,
	echo_transfer_topic: string,
	echo_transfer_ready_topic: string,
	eth_contract_address: string,
	eth_committee_method: string,
	eth_transfer_topic: string,
}
