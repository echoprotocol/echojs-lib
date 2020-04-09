import Cache from './cache';
import API from './api';
import Subscriber from './subscriber';
import Transaction from './transaction';
import { STATUS, DEFAULT_CHAIN_APIS } from '../constants/ws-constants';
import { WalletApi } from './apis';
import EchoApiEngine from './engine';
import { ConnectionType, WsProvider, HttpProvider } from './providers';

/** @typedef {{ batch?: number, timeout?: number }} RegistrationOptions */

/** @typedef {{ cache?: import("./cache").Options, apis?: string[], registration?: RegistrationOptions }} Options */

class Echo {

	constructor() {
		/** @type {EchoApiEngine | null} */
		this.engine = null;
		this._isInitModules = false;
		this.initEchoApi = this.initEchoApi.bind(this);
		this.walletApi = new WalletApi();
	}

	get isConnected() {
		if (this.engine === null) return false;
		if (this.engine.provider.connectionType === ConnectionType.HTTP) return true;
		return this.engine.provider.connected;
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
		const provider = address.startsWith('ws') ? new WsProvider() : new HttpProvider(address);
		if (provider.connectionType === ConnectionType.WS) await provider.connect(address, options);
		this.engine = new EchoApiEngine(options.apis || DEFAULT_CHAIN_APIS, provider);
		if (this._isInitModules) return;

		await this._initModules(options);

		if (!options.store && this.store) {
			options.store = this.store;
		}

		this.cache.setOptions(options);
		this.subscriber = new Subscriber(this.engine);
		this.subscriber.setOptions(options);
	}

	/**
	 * @param {string} address
	 * @param {Options} options
	 */
	async connect(address, options = {}) {
		if (this.isConnected) throw new Error('Connected');
		await Promise.all([
			...address ? [this._connectToNode(address, options)] : [],
			...options.wallet ? [this.walletApi.connect(options.wallet, options)] : [],
		]);
	}

	/** @param {Options} options */
	async _initModules(options) {
		this._isInitModules = true;

		this.cache = new Cache(options.cache);
		this.api = new API(this.cache, this.engine, options.registration);
		await this.engine.init();
		// await this.subscriber.init(this.cache, this.engine, this.api);
		// this._ws.on(STATUS.OPEN, this.initEchoApi);
	}

	async initEchoApi() {
		await this._ws.initEchoApi();
		// await this.subscriber.init(this.cache, this.engine, this.api);
	}

	syncCacheWithStore(store) {
		if (this.isConnected) {
			this.cache.setStore({ store });
		}
		this.store = store;
	}

	async reconnect() {
		this._ws.removeListener(STATUS.OPEN, this.initEchoApi);
		await this._ws.reconnect();
		await this.initEchoApi();
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
