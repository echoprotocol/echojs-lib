import WS from './ws';
import WSAPI from './ws-api';

import Cache from './cache';
import API from './api';
import Subscriber from './subscriber';

class Echo {

	constructor() {
		this._ws = new WS();
		this._isInitModules = false;
	}

	async connect(address, options) {
		if (this._ws._connected) {
			throw new Error('Connected');
		}

		try {
			await this._ws.connect(address, options);

			if (this._isInitModules) {
				return;
			}

			await this._initModules();

			this.cache.setOptions(options);
			this.api.setOptions(options);
			this.subscriber.setOptions(options);
		} catch (e) {
			throw e;
		}

	}

	async _initModules() {
		this._isInitModules = true;

		this._wsApi = new WSAPI(this._ws);

		this.cache = new Cache();
		this.api = new API(this.cache, this._wsApi);
		this.subscriber = new Subscriber(this.cache, this._wsApi);

		await this.subscriber.init();
	}

	async reconnect() {
		this._ws.reconnect();
		await this.subscriber.init();
	}

	disconnect() {
		this.api.reset();
		this.subscriber.reset();
		this._ws.close();
	}

}

export default Echo;
