import AccountHistory from './AccountHistory';
import { SerializerOutput } from '../serializers/ISerializer';
import { authority } from '../serializers/protocol';
import { int64 } from '../serializers/basic/integers';

export default interface FullAccount {
	accumulated_reward: typeof int64, //   typedef safe<int64_t>    
	id: string,
	membership_expiration_date: string,
	registrar: string,
	referrer: string,
	lifetime_referrer: string,
	network_fee_percentage: number,
	lifetime_referrer_fee_percentage: number,
	referrer_rewards_percentage: number,
	active_delegate_share: number,
	name: string,
	owner: unknown,
	active: SerializerOutput<typeof authority>,
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
