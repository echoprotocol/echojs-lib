import { int64, uint8, uint16, uint64 } from '../basic/integers';
import { struct } from '../collections';

// eslint-disable-next-line import/prefer-default-export
export const config = struct({
	blocks_in_interval: uint64,
	maintenances_in_interval: uint8,
	block_emission_amount: int64,
	block_producer_reward_ratio: uint16,
	pool_divider: uint16,
});
