import { assetId } from '../chain/id/protocol';
import { struct, map, set } from '../collections';
import feeScheduleSerializer from './fee_schedule';
import { uint8, uint32, uint16, uint64 } from '../basic/integers';
import { echorand, sidechain } from '../plugins';
import { extensions } from '../chain';

import * as economy from './economy';

const chainParametersSerializer = struct({
	current_fees: feeScheduleSerializer,
	maintenance_interval: uint32,
	maintenance_duration_seconds: uint8,
	balance_unfreezing_time: uint32,
	committee_proposal_review_period: uint32,
	maximum_transaction_size: uint32,
	maximum_block_size: uint32,
	maximum_time_until_expiration: uint32,
	maximum_proposal_lifetime: uint32,
	maximum_asset_whitelist_authorities: uint8,
	maximum_asset_feed_publishers: uint8,
	maximum_authority_membership: uint16,
	max_authority_depth: uint8,
	committee_frozen_balance_to_activate: uint64,
	committee_maintenance_intervals_to_deposit: uint64,
	committee_balance_unfreeze_duration_seconds: uint32,
	x86_64_maximum_contract_size: uint64,
	frozen_balances_multipliers: map(uint16, uint32),
	echorand_config: echorand.config,
	sidechain_config: sidechain.config,
	erc20_config: sidechain.erc20Config,
	gas_price: struct({ price: uint64, gas_amount: uint64 }),
	valid_fee_asset: set(assetId),
	economy_config: economy.config,
	extensions,
});

export default chainParametersSerializer;
