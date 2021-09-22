import { int64, uint16 } from "../basic/integers";
import { struct } from "../collections";

export const spvPenaltiesConfig = struct({
	missed_deposit_penalty: int64,
	excess_withdraw_penalty: int64,
	missed_withdraw_penalty: int64,
	penalty_multiplier: uint16,
});
