import serializable from './serializable';
import { uint16, staticVariant } from './basic-types';

export const refundWorkerInitializer = serializable({});
export const vestingBalanceWorkerInitializer = serializable({ pay_vesting_period_days: uint16 });
export const burnWorkerInitializer = serializable({});

export const REFUND_WORKER_INITIALIZER = 0;
export const VESTING_BALANCE_WORKER_INITIALIZER = 1;
export const BURN_WORKER_INITIALIZER = 2;

export default staticVariant({
	[REFUND_WORKER_INITIALIZER]: refundWorkerInitializer,
	[VESTING_BALANCE_WORKER_INITIALIZER]: vestingBalanceWorkerInitializer,
	[BURN_WORKER_INITIALIZER]: burnWorkerInitializer,
});
