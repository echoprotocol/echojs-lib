import feeScheduleSerializer from './fee_schedule';
import { uint8, uint32, uint16, uint64 } from '../basic/integers';
import { extensions } from '../chain';
import { assetId } from '../chain/id/protocol';
import { StructSerializer, SetSerializer } from '../collections';
import { MapSerializer } from '../collections';
import { echorand, sidechain } from '../plugins';

import * as economy from './economy';

declare const chainParametersSerializer: StructSerializer<{
	current_fees: typeof feeScheduleSerializer,
	maintenance_interval: typeof uint32,
	maintenance_duration_seconds: typeof uint8,
	balance_unfreezing_time: typeof uint32,
	committee_proposal_review_period: typeof uint32,
	maximum_transaction_size: typeof uint32,
	maximum_block_size: typeof uint32,
	maximum_time_until_expiration: typeof uint32,
	maximum_proposal_lifetime: typeof uint32,
	maximum_asset_whitelist_authorities: typeof uint8,
	maximum_asset_feed_publishers: typeof uint8,
	maximum_authority_membership: typeof uint16,
	max_authority_depth: typeof uint8,
	block_emission_amount: typeof uint64,
	block_producer_reward_ratio: typeof uint16,
	committee_frozen_balance_to_activate: typeof uint64,
	committee_maintenance_intervals_to_deposit: typeof uint64,
	committee_balance_unfreeze_duration_seconds: typeof uint32,
	x86_64_maximum_contract_size: typeof uint64,
	frozen_balances_multipliers: MapSerializer<typeof uint16, typeof uint32>,
	echorand_config: typeof echorand.config,
	sidechain_config: typeof sidechain.config,
	erc20_config: typeof sidechain.erc20Config,
	gas_price: StructSerializer<{ price: typeof uint64, gas_amount: typeof uint64 }>,
	valid_fee_asset: SetSerializer<typeof assetId>,
	economy_config: typeof economy.config,
	extensions: typeof extensions,
}>;

export default chainParametersSerializer;
