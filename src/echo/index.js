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
	    console.log('connect');
		if (this._ws._connected) {
			throw new Error('Connected');
		}
        console.log('connect 1');
		try {
			await this._ws.connect(address, options);
            console.log('connect 2');
			if (this._isInitModules) {
				return;
			}
            console.log('connect 3');
			await this._initModules();
            console.log('connect 4');
			this.cache.setOptions(options);
			this.subscriber.setOptions(options);
		} catch (e) {
		    console.log('connect error', e);
			throw e;
		}

	}

	async _initModules() {
		this._isInitModules = true;

		this._wsApi = new WSAPI(this._ws);

		console.log('_initModules 1');
		this.cache = new Cache();
		console.log('_initModules 2');
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
	    console.log('syncCacheWithStore')
		this.cache.setStore({ store });
		console.log('syncCacheWithStore 1')
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
