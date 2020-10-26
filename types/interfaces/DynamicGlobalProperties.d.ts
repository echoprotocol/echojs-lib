export default interface DynamicGlobalProperties {
	id: string,
	head_block_number: number,
	head_block_id: string,
	time: string,
	next_maintenance_time: string,
	last_maintenance_time: string,
	committee_budget: number,
	dynamic_flags: number,
	last_irreversible_block_num: number,
	last_block_of_previous_interval: number,
	last_processed_btc_block: number | string,
	extensions: unknown[],
}
