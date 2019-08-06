export default interface ChainProperties {
	id: string,
	chain_id: string,
	immutable_parameters:{
		min_committee_member_count: number,
		num_special_accounts: number,
		num_special_assets: number
	}
}
