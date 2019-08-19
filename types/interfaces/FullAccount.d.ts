import AccountHistory from './AccountHistory';
import { authority } from './serializer/composit-types';
import { serialization_output } from './serializer/serialization';

export default interface FullAccount {
	id: string,
	membership_expiration_date: string,
	registrar: string,
	referrer: string,
	lifetime_referrer: string,
	network_fee_percentage: number,
	lifetime_referrer_fee_percentage: number,
	referrer_rewards_percentage: number,
	name: string,
	owner: unknown,
	active: authority<serialization_output>,
	ed_key: string,
	options: unknown,
	statistics: string,
	whitelisting_accounts: Array<unknown>,
	blacklisting_accounts: Array<unknown>,
	whitelisted_accounts: Array<unknown>,
	blacklisted_accounts: Array<unknown>,
	owner_special_authority: Array<unknown>,
	active_special_authority: Array<unknown>,
	top_n_control_flags: number,
	history: Array<AccountHistory>,
	balances: unknown,
	limit_orders: unknown,
	call_orders: unknown,
	proposals: unknown
}
