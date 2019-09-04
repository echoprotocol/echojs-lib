import feeScheduleSerializer from './fee_schedule';
import { uint8, uint32, uint16, uint64 } from '../basic/integers';
import { extensions } from '../chain';
import { StructSerializer } from '../collections';
import { echorand, sidechain } from '../plugins';

declare const chainParametersSerializer: StructSerializer<{
	current_fees: typeof feeScheduleSerializer,
	block_interval: typeof uint8,
	maintenance_interval: typeof uint32,
	maintenance_duration_seconds: typeof uint8,
	committee_proposal_review_period: typeof uint32,
	maximum_transaction_size: typeof uint32,
	maximum_block_size: typeof uint32,
	maximum_time_until_expiration: typeof uint32,
	maximum_proposal_lifetime: typeof uint32,
	maximum_asset_whitelist_authorities: typeof uint8,
	maximum_asset_feed_publishers: typeof uint8,
	maximum_committee_count: typeof uint16,
	maximum_authority_membership: typeof uint16,
	reserve_percent_of_fee: typeof uint16,
	network_percent_of_fee: typeof uint16,
	commitee_pay_vesting_seconds: typeof uint32,
	max_predicate_opcode: typeof uint16,
	accounts_per_fee_scale: typeof uint16,
	account_fee_scale_bitshifts: typeof uint8,
	max_authority_depth: typeof uint8,
	echorand_config: typeof echorand.config,
	sidechain_config: typeof sidechain.config,
	erc20_config: typeof sidechain.erc20Config,
	gas_price: StructSerializer<{ price: typeof uint64, gas_amount: typeof uint64 }>,
	extensions: typeof extensions,
}>;

export default chainParametersSerializer;