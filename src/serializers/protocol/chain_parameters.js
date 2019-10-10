import { struct, map } from '../collections';
import feeScheduleSerializer from './fee_schedule';
import { uint8, uint32, uint16, uint64 } from '../basic/integers';
import { echorand, sidechain } from '../plugins';
import { extensions } from '../chain';

const chainParametersSerializer = struct({
	current_fees: feeScheduleSerializer,
	maintenance_interval: uint32,
	maintenance_duration_seconds: uint8,
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
	committee_pay_vesting_seconds: uint32,
	max_predicate_opcode: uint16,
	accounts_per_fee_scale: uint16,
	account_fee_scale_bitshifts: uint8,
	max_authority_depth: uint8,
	frozen_balances_multipliers: map(uint16, uint32),
	echorand_config: echorand.config,
	sidechain_config: sidechain.config,
	erc20_config: sidechain.erc20Config,
	gas_price: struct({ price: uint64, gas_amount: uint64 }),
	extensions,
});

export default chainParametersSerializer;
