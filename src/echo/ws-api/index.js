import DatabaseAPI from './database-api';
import AssetAPI from './asset-api';
import NetworkAPI from './network-api';
import HistoryAPI from './history-api';
import RegistrationAPI from './registration-api';
import LoginAPI from './login-api';


class WSAPI {

	constructor(ws) {
		this.ws = ws;

		this.database = new DatabaseAPI(this.ws.Apis.instance().dbApi());
		this.asset = new AssetAPI(this.ws.Apis.instance().assetApi());
		this.network = new NetworkAPI(this.ws.Apis.instance().networkApi());
		this.history = new HistoryAPI(this.ws.Apis.instance().historyApi());
		this.registration = new RegistrationAPI(this.ws.Apis.instance().registrationApi());
		this.login = new LoginAPI(this.ws.Apis.instance().loginApi());
	}

}

export default WSAPI;
