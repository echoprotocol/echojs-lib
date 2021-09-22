import { int64, uint16 } from "../basic/integers";
import { StructSerializer } from "../collections";

export const spvPenaltiesConfig: StructSerializer<{
	missed_deposit_penalty: typeof int64,
	excess_withdraw_penalty: typeof int64,
	missed_withdraw_penalty: typeof int64,
	penalty_multiplier: typeof uint16,
}>;
