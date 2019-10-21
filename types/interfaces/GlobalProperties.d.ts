export default interface GlobalProperties {
	id: string,
	parameters: Object,
	next_available_vote_id: number,
	active_committee_members: Array<Array<string>>,
}
