import { int64, uint16 } from "../basic/integers";
import { StructSerializer } from "../collections";

export const spvPenaltiesConfig: StructSerializer<{
	missed_gen_address_penalty: typeof int64,
	missed_deposit_penalty: typeof int64,
	missed_withdraw_penalty: typeof int64,
	missed_balance_update_penalty: typeof int64,
	missed_erc20_deposit_penalty: typeof int64,
	missed_erc20_withdraw_penalty: typeof int64,
	missed_erc20_transfer_penalty: typeof int64,
	excess_withdraw_penalty: typeof int64,
	penalty_multiplier: typeof uint16,
}>;
