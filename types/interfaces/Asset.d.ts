export default interface Asset {
	id: string,
	symbol: string,
	precision:Number,
	issuer: string,
	options: Object,
	dynamic_asset_data_id: string,
	dynamic: Object,
	bitasset: (Object | undefined)
}
