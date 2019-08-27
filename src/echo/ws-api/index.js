import DatabaseAPI from './database-api';
import AssetAPI from './asset-api';
import NetworkAPI from './network-api';
import HistoryAPI from './history-api';
import RegistrationAPI from './registration-api';
import LoginAPI from './login-api';
import NetworkNodeAPI from './network-node-api';


class WSAPI {

	/**
	 *  @constructor
	 *
	 *  @param {WS} ws
	 */
	constructor(ws) {
		this.ws = ws;

		this.database = new DatabaseAPI(this.ws.dbApi());
		this.asset = new AssetAPI(this.ws.assetApi());
		this.network = new NetworkAPI(this.ws.networkApi());
		this.history = new HistoryAPI(this.ws.historyApi());
		this.registration = new RegistrationAPI(this.ws.registrationApi());
		this.login = new LoginAPI(this.ws.loginApi());
		this.networkNode = new NetworkNodeAPI(this.ws.networkNodeApi());
	}

}

export default WSAPI;
