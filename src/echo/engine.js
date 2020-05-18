import { CHAIN_API } from '../constants/ws-constants';
import * as Apis from './apis';

/** @typedef {import("./providers").WsProvider} WsProvider */
/** @typedef {import("./providers").HttpProvider} HttpProvider */

export default class EchoApiEngine {

	/**
	 * @param {string[]} apis
	 * @param {WsProvider | HttpProvider} provider
	 */
	constructor(apis, provider) {
		this.provider = provider;
		this[CHAIN_API.DATABASE_API] = new Apis.DatabaseApi(this.provider);
		this[CHAIN_API.ASSET_API] = new Apis.AssetApi(this.provider);
		this[CHAIN_API.NETWORK_BROADCAST_API] = new Apis.NetworkApi(this.provider);
		this[CHAIN_API.HISTORY_API] = new Apis.HistoryApi(this.provider);
		this[CHAIN_API.REGISTRATION_API] = new Apis.RegistrationApi(this.provider);
		this[CHAIN_API.LOGIN_API] = new Apis.LoginApi(this.provider);
		this[CHAIN_API.NETWORK_NODE_API] = new Apis.NetworkNodeApi(this.provider);
		this[CHAIN_API.ECHORAND_API] = new Apis.EchoRandApi(this.provider);
		this[CHAIN_API.DID_API] = new Apis.EchoRandApi(this.provider);
		this.apis = [...apis];
	}

	init() {
		return Promise.all(this.apis.map((apiName) => this[apiName].init()));
	}

}
