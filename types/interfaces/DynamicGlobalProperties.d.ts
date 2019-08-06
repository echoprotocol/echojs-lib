export default interface DynamicGlobalProperties {
	id: string,
	head_block_number: number,
	head_block_id: string,
	time: string,
	next_maintenance_time: string,
	last_budget_time: string,
	committee_budget: number,
	accounts_registered_this_interval: number,
	recently_missed_count: number,
	current_aslot: number,
	recent_slots_filled: string,
	dynamic_flags: number,
	last_irreversible_block_num: number
}
