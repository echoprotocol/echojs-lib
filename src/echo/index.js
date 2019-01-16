import WS from './ws';
import WSAPI from './ws-api';

import Cache from './cache';
import API from './api';
import Subscriber from './subscriber';
import Transaction from './transaction';

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
		this.subscriber = new Subscriber(this.cache, this._wsApi, this.api, this._ws);

		await this.subscriber.init();

		this._ws.on('open', async () => {
			try {
				await this.subscriber.init();
			} catch (err) {
				console.log('ONOPEN init error', err);
			}
		});
	}

	syncCacheWithStore(store) {
		this.cache.setStore({ store });
	}

	async reconnect() {
		await this._ws.reconnect();
	}

	async disconnect() {
		this.subscriber.reset();
		await this._ws.close();
	}

	/** @returns {Transaction} */
	createTransaction() { return new Transaction(this.api); }

}

export default Echo;