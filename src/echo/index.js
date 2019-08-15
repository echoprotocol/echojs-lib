import WS from './ws';
import WSAPI from './ws-api';

import Cache from './cache';
import API from './api';
import Subscriber from './subscriber';
import Transaction from './transaction';
import { STATUS } from '../constants/ws-constants';

/** @typedef {{ cache?: import("./cache").Options, apis?: string[] }} Options */

class Echo {

	constructor() {
		this.subscriber = new Subscriber();
		this._ws = new WS(this.subscriber);
		this._isInitModules = false;

		// this.subscriber = new Subscriber();
	}

	get isConnected() {
		return this._ws._connected;
	}

	/**
	 * @param {string} address
	 * @param {Options} options
	 */
	async connect(address, options = {}) {
		if (this._ws._connected) {
			throw new Error('Connected');
		}

		try {
			await this._ws.connect(address, options);

			if (this._isInitModules) {
				return;
			}

			await this._initModules(options);
			this._ws.emit(STATUS.OPEN);

			if (!options.store && this.store) {
				options.store = this.store;
			}

			this.cache.setOptions(options);
			this.subscriber.setOptions(options);
		} catch (e) {
			throw e;
		}

	}

	/** @param {Options} options */
	async _initModules(options) {
		this._isInitModules = true;

		this._wsApi = new WSAPI(this._ws);

		this.cache = new Cache(options.cache);
		this.api = new API(this.cache, this._wsApi);
		try {
			await this.subscriber.init(this.cache, this._wsApi, this.api, this._ws);
		} catch (err) {
			console.log('ONOPEN init error', err);
		}
	}

	syncCacheWithStore(store) {
		if (this._ws._connected) {
			this.cache.setStore({ store });
		}
		this.store = store;
	}

	async reconnect() {
		// this.subscriber.cbDisconnect();
		await this._ws.reconnect();
		// this.subscriber.cbConnect();
	}

	async disconnect() {
		this.subscriber.reset();
		this.cache.reset();
		await this._ws.close();
		this._ws.emit(STATUS.CLOSE);
		this.onOpen = null;
		this._isInitModules = false;
	}

	/** @returns {Transaction} */
	createTransaction() { return new Transaction(this.api); }

}

export default Echo;
