import WS from './ws';
import WSAPI from './ws-api';

import Cache from './cache';
import API from './api';
import Subscriber from './subscriber';
import Transaction from './transaction';
import { STATUS, DEFAULT_CHAIN_APIS } from '../constants/ws-constants';
import WalletAPI from './ws-api/wallet-api';

/** @typedef {{ batch?: number, timeout?: number }} RegistrationOptions */

/** @typedef {{ cache?: import("./cache").Options, apis?: string[], registration?: RegistrationOptions }} Options */

class Echo {

	constructor() {
		this._ws = new WS();
		this.subscriber = new Subscriber(this._ws);
		this._isInitModules = false;
		this.initEchoApi = this.initEchoApi.bind(this);
		this.walletApi = new WalletAPI();
	}

	get isConnected() {
		return this._ws.isConnected;
	}

	/**
	 * @readonly
	 * @type {Set<string>}
	 */
	get apis() { return new Set(this._ws.apis); }

	/**
	 * @param {string} address
	 * @param {Options} options
	 * @private
	 */
	async _connectToNode(address, options) {
		const apis = options.apis === undefined ? DEFAULT_CHAIN_APIS : options.apis;
		await this._ws.connect(address, apis, options);
		this._wsApi = new WSAPI(this._ws);
		this.cache = new Cache(options.cache);
		this.api = new API(this.cache, this._wsApi, options.registration);
		if (!options.store && this.store) options.store = this.store;
		this.cache.setOptions(options);
		this.subscriber.setOptions(options);
		await this.subscriber.init(this.cache, this._wsApi, this.api);
	}

	/**
	 * @param {string} address
	 * @param {Options} options
	 */
	async connect(address, options = {}) {
		await Promise.all([
			...address ? [this._connectToNode(address, options)] : [],
			...options.wallet ? [this.walletApi.connect(options.wallet, options)] : [],
		]);
	}

	async initEchoApi() {
		await this._ws.initEchoApi();
		await this.subscriber.init(this.cache, this._wsApi, this.api);
	}

	syncCacheWithStore(store) {
		if (this._ws._connected) {
			this.cache.setStore({ store });
		}
		this.store = store;
	}

	async reconnect() {
		this._ws.removeListener(STATUS.OPEN, this.initEchoApi);
		await this._ws.reconnect();
		await this.initEchoApi();
		this._ws.on(STATUS.OPEN, this.initEchoApi);
	}

	async disconnect() {
		this.subscriber.callCbOnDisconnect();
		this.subscriber.reset();
		this.cache.reset();
		await this._ws.close();
		this.onOpen = null;
		this._isInitModules = false;
		this._ws.removeListener(STATUS.OPEN, this.initEchoApi);
	}

	/** @returns {Transaction} */
	createTransaction() { return new Transaction(this.api); }

}

export default Echo;

export const echo = new Echo();
