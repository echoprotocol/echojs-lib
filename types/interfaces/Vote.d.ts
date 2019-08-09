export default interface Vote {
	id: string,
	committee_member_account: (string | undefined),
	vote_id: string,
	total_votes: number,
	url: string,
	last_aslot: (number | undefined),
	signing_key: (string | undefined),
	pay_vb: (string | undefined),
	total_missed: (number | undefined),
	last_confirmed_block_num: (number | undefined),
	ed_signing_key: (string | undefined)
}
