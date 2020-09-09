export default interface FrozenBalance {
	id: string,
	owner: string,
	balance: { amount: number | string, asset_id: string },
	multiplier: number,
	unfreeze_availability_time: number;
	unfreeze_time?: number,
	extensions: unknown[],
}
