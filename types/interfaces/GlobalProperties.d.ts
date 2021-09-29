import Price from "./Price";

export default interface GlobalProperties {
	id: string,
	parameters: object,
	pending_parameters?: object,
	active_committee_members: Array<Array<string>>,
	consensus_assets_prices: Array<Price>
}
