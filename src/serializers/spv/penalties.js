import { int64, uint16 } from '../basic/integers';
import { struct } from '../collections';

export const spvPenaltiesConfig = struct({
	missed_gen_address_penalty: int64,
	missed_deposit_penalty: int64,
	missed_withdraw_penalty: int64,
	missed_balance_update_penalty: int64,
	missed_erc20_deposit_penalty: int64,
	missed_erc20_withdraw_penalty: int64,
	missed_erc20_transfer_penalty: int64,
	excess_withdraw_penalty: int64,
	penalty_multiplier: uint16,
});

export default { spvPenaltiesConfig };
