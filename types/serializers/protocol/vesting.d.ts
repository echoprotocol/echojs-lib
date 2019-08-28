import { timePointSec } from '../basic';
import { uint32 } from '../basic/integers';
import { asset, extensions } from '../chain';
import { accountId, vestingBalanceId } from '../chain/id/protocol';
import { struct, staticVariant, StructSerializer, StaticVariantSerializer } from '../collections';
import { vesting } from '../../constants/protocol';

export declare const linearVestingPolicyInitializer: StructSerializer<{
	begin_timestamp: typeof timePointSec,
	vesting_cliff_seconds: typeof uint32,
	vesting_duration_seconds: typeof uint32,
}>;

export declare const cddVestingPolicyInitializer: StructSerializer<{
	start_claim: typeof timePointSec,
	vesting_seconds: typeof uint32,
}>;

export declare const vestingPolicyInitializer: StaticVariantSerializer<{
	[vesting.policyInitializerTypes.LINEAR]: typeof linearVestingPolicyInitializer,
	[vesting.policyInitializerTypes.CDD]: typeof cddVestingPolicyInitializer,
}>;

export declare const vestingBalanceCreateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	creator: typeof accountId,
	owner: typeof accountId,
	amount: typeof asset,
	policy: typeof vestingPolicyInitializer,
	extensions: typeof extensions,
}>;

export declare const vestingBalanceWithdrawOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	vesting_balance: typeof vestingBalanceId,
	owner: typeof accountId,
	amount: typeof asset,
	extensions: typeof extensions,
}>;
