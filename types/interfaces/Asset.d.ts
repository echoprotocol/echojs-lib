export default interface Asset {
	id: string;
	symbol: string;
	precision:number;
	issuer: string;
	options: object;
	dynamic_asset_data_id: string;
	dynamic: object;
	bitasset: object|undefined;
}
