import DatabaseAPI from './database-api';
import AssetAPI from './asset-api';
import NetworkAPI from './network-api';
import HistoryAPI from './history-api';
import RegistrationAPI from './registration-api';
import LoginAPI from './login-api';
import NetworkNodeAPI from './network-node-api';
import { CHAIN_API } from '../../constants/ws-constants';


class WSAPI {

	/**
	 *  @constructor
	 *
	 *  @param {import("../ws").default} ws
	 */
	constructor(ws) {
		this.ws = ws;

		this.database = new DatabaseAPI(this.ws.echoApis[CHAIN_API.DATABASE_API]);
		this.asset = new AssetAPI(this.ws.echoApis[CHAIN_API.ASSET_API]);
		this.network = new NetworkAPI(this.ws.echoApis[CHAIN_API.NETWORK_BROADCAST_API]);
		this.history = new HistoryAPI(this.ws.echoApis[CHAIN_API.HISTORY_API]);
		this.registration = new RegistrationAPI(this.ws.echoApis[CHAIN_API.REGISTRATION_API]);
		this.login = new LoginAPI(this.ws.echoApis[CHAIN_API.LOGIN_API]);
		this.networkNode = new NetworkNodeAPI(this.ws.echoApis[CHAIN_API.NETWORK_NODE_API]);
	}

}

export default WSAPI;
