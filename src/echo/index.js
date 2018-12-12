import WS from './ws';
import WSAPI from './ws/api';

import Cache from './cache';
import API from './api';
import Subscriber from './subscriber';

class Echo {

	constructor() {
		this._ws = new WS();
		this._wsApi = new WSAPI(this._ws);

		this.cache = new Cache();
		this.api = new API(this.cache, this._wsApi);
		this.subscriber = new Subscriber(this.cache, this._wsApi);
	}

	async connect(address, options) {
		if (this._ws._connected) {
			throw new Error('Connected');
		}

		this.cache.setOptions(options);
		this.api.setOptions(options);
		this.subscriber.setOptions(options);

		try {
			await this._ws.connect(address, options);
		} catch (e) {
			throw e;
		}

	}

	reconnect(address, options) {
		this._ws.reconnect(address, options);
	}

	disconnect() {
		this.api.reset();
		this.subscriber.reset();
		this._ws.close();
	}

}

export default Echo;
