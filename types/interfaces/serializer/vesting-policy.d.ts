import { time_point_sec, uint32 } from "./basic-types";
import serialization from "./serialization";

export interface linear_vesting_policy_initializer<T extends serialization> {
	begin_timestamp: time_point_sec<T>,
	vesting_cliff_seconds: uint32<T>,
	vesting_duration_seconds: uint32<T>,
}

export interface cdd_vesting_policy_initializer<T extends serialization> {
	start_claim: time_point_sec<T>,
	vesting_seconds: uint32<T>,
}

export enum VestingPolicyInitializer {
	LINEAR = 0,
	CDD = 1,
}

type vesting_policy<TInitializer extends VestingPolicyInitializer, T extends serialization> = TInitializer extends any ?
	{
		[VestingPolicyInitializer.LINEAR]: linear_vesting_policy_initializer<T>,
		[VestingPolicyInitializer.CDD]: cdd_vesting_policy_initializer<T>,
	}[TInitializer] : never;
