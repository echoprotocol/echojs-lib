import { int64, uint8, uint16, uint64 } from "../basic/integers";
import { StructSerializer } from "../collections";

export declare const config: StructSerializer<{
	blocks_in_interval: typeof uint64,
	maintenances_in_interval: typeof uint8,
	block_emission_amount: typeof int64,
	block_producer_reward_ratio: typeof uint16,
	pool_divider: typeof uint16,
}>;
