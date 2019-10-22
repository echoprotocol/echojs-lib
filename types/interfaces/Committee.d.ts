export default interface Committee {
	id: string,
	committee_member_account: string,
	url: string,
	eth_address: string,
	btc_public_key: string,
	last_committee_quit: number
}
