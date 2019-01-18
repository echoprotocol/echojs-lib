import serializable from './serializable';
import staticVariant from './basic-types/static-variant';
import { timePointSec, uint32 } from './basic-types';

export const linearVestingPolicyInitializer = serializable({
	begin_timestamp: timePointSec,
	vesting_cliff_seconds: uint32,
	vesting_duration_seconds: uint32,
});

export const cddVestingPolicyInitializer = serializable({
	start_claim: timePointSec,
	vesting_seconds: uint32,
});

export const LINEAR_VESTING_POLICY_INITIALIZER = 0;
export const CDD_VESTING_POLICY_INITIALIZER = 1;

export default staticVariant({
	[LINEAR_VESTING_POLICY_INITIALIZER]: linearVestingPolicyInitializer,
	[CDD_VESTING_POLICY_INITIALIZER]: cddVestingPolicyInitializer,
});
