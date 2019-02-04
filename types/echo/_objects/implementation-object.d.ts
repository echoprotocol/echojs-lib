import { IMPLEMENTATION_OBJECT } from "../../constants/chain-types";

type ImplementationObject = {
	[IMPLEMENTATION_OBJECT.GLOBAL_PROPERTY]: void,
	[IMPLEMENTATION_OBJECT.DYNAMIC_GLOBAL_PROPERTY]: {
		recently_missed_count: number,
		accounts_registered_this_interval: number,
		next_maintenance_time: string,
		dynamic_flags: number,
		witness_budget: number,
		head_block_id: string,
		time: string,
		recent_slots_filled: string,
		current_witness: string,
		current_aslot: number,
		head_block_number: number,
		id: string,
		last_irreversible_block_num: number,
		last_budget_time: string,
	},
	[IMPLEMENTATION_OBJECT.INDEX_META]: void,
	[IMPLEMENTATION_OBJECT.ASSET_DYNAMIC_DATA]: void,
	[IMPLEMENTATION_OBJECT.ASSET_BITASSET_DATA]: void,
	[IMPLEMENTATION_OBJECT.ACCOUNT_BALANCE]: {
		id: string,
		owner: string,
		asset_type: string,
		balance: string,
	},
	[IMPLEMENTATION_OBJECT.ACCOUNT_STATISTICS]: void,
	[IMPLEMENTATION_OBJECT.TRANSACTION]: void,
	[IMPLEMENTATION_OBJECT.BLOCK_SUMMARY]: void,
	[IMPLEMENTATION_OBJECT.ACCOUNT_TRANSACTION_HISTORY]: void,
	[IMPLEMENTATION_OBJECT.BLINDED_BALANCE]: void,
	[IMPLEMENTATION_OBJECT.CHAIN_PROPERTY]: void,
	[IMPLEMENTATION_OBJECT.WITNESS_SCHEDULE]: void,
	[IMPLEMENTATION_OBJECT.BUDGET_RECORD]: void,
}

export default ImplementationObject;
