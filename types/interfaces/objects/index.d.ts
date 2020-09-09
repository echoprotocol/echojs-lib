import { protocol } from "../../serializers";

export * from "./eth_sidechain";

export enum VMType {
	EVM = 0,
	X86_64 = 1,
}

export interface IObject { id: string; }

export interface IContractObject extends IObject {
	type: VMType;
	destroyed: boolean;
	statistics: string;
	supported_asset_id?: string;
	owner?: string;
	extensions: unknown[];
}

export interface IERC20TokenObject extends IObject {
	owner: string;
	eth_addr: string;
	contract: string;
	name: string;
	symbol: string;
	decimals: number;
	extensions: unknown[];
}

export interface IAssetObject extends IObject {
	symbol: string;
	precision: number;
	issuer: string;
	options: typeof protocol.asset.options["__TOutput__"];
	dynamic_asset_data_id: string;
	bitasset_data_id?: string;
	buyback_account?: string;
	extensions: unknown[];
}

export interface IAccountObject extends IObject {
	registrar: string;
	name: string;
	active: typeof protocol.authority["__TOutput__"];
	echorand_key: string;
	active_delegate_share: number;
	options: typeof protocol.account.options["__TOutput__"];
	statistics: string;
	whitelisting_accounts: string[];
	blacklisting_accounts: string[];
	whitelisted_accounts: string[];
	blacklisted_accounts: string[];
	active_special_authority: unknown;
	top_n_control_flags: number;
	allowed_assets?: string[];
	accumulated_reward: number | string;
	extensions: unknown[];
}
