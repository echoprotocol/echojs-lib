import { timePointSec } from '../basic';
import { uint32 } from '../basic/integers';
import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { struct, staticVariant } from '../collections';
import { vesting } from '../../constants/protocol';

export const linearVestingPolicyInitializer = struct({
	begin_timestamp: timePointSec,
	vesting_cliff_seconds: uint32,
	vesting_duration_seconds: uint32,
});

export const cddVestingPolicyInitializer = struct({
	start_claim: timePointSec,
	vesting_seconds: uint32,
});

export const vestingPolicyInitializer = staticVariant({
	[vesting.policyInitializerTypes.LINEAR]: linearVestingPolicyInitializer,
	[vesting.policyInitializerTypes.CDD]: cddVestingPolicyInitializer,
});

export const vestingBalanceCreateOperationPropsSerializer = struct({
	fee: asset,
	creator: accountId,
	owner: accountId,
	amount: asset,
	policy: vestingPolicyInitializer,
	extensions,
});
