/* global window */
import Cache from './cache';
import API from './api';
import Subscriber from './subscriber';
import Transaction from './transaction';
import { STATUS, DEFAULT_CHAIN_APIS, CHAIN_API } from '../constants/ws-constants';
import { WalletApi } from './apis';
import EchoApiEngine from './engine';
import { ConnectionType, WsProvider, HttpProvider } from './providers';
import { validateUrl, validateOptionsError } from '../utils/validators';

/** @typedef {{ batch?: number, timeout?: number }} RegistrationOptions */

/** @typedef {{ cache?: import("./cache").Options, apis?: string[], registration?: RegistrationOptions }} Options */

class Echo {

	constructor() {
		/** @type {EchoApiEngine | null} */
		this.engine = null;
		this._isInitModules = false;
		this.initEchoApi = this.initEchoApi.bind(this);
		this.walletApi = new WalletApi();
		this.subscriber = new Subscriber();
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
	get apis() { return new Set(this.engine.apis); }

	/**
	 * @param {string} address
	 * @param {Options} options
	 * @private
	 */
	async _connectToNode(address, options) {
		if (!validateUrl(address)) throw new Error(`Invalid address ${address}`);
		if (
			typeof window !== 'undefined' &&
			window.location &&
			window.location.protocol === 'https:' &&
			!address.startsWith('wss://') &&
			!address.startsWith('https://')
		) {
			throw new Error('Secure domains require wss/https connection');
		}
		const optionError = validateOptionsError(options);
		if (optionError) throw new Error(optionError);
		const provider = address.startsWith('ws') ? new WsProvider() : new HttpProvider(address);
		if (provider.connectionType === ConnectionType.WS) await provider.connect(address, options);
		const apis = options.apis ||
			(provider.connectionType === ConnectionType.WS ? DEFAULT_CHAIN_APIS : [CHAIN_API.DATABASE_API]);
		this.engine = new EchoApiEngine(apis, provider);
		if (this._isInitModules) return;
		this.subscriber.setOptions(options);
		await this._initModules(options);

		if (!options.store && this.store) {
			options.store = this.store;
		}

		this.cache.setOptions(options);
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
		await this.initEchoApi();
		if (this.engine.provider.connectionType === ConnectionType.WS) {
			this.engine.provider.on(STATUS.OPEN, this.initEchoApi);
		}
	}

	async initEchoApi() {
		await this.engine.init();
		if (this.engine.provider.connectionType === ConnectionType.WS) {
			await this.subscriber.init(this.cache, this.engine, this.api);
		}
	}

	syncCacheWithStore(store) {
		if (this.isConnected) {
			this.cache.setStore({ store });
		}
		this.store = store;
	}

	async reconnect() {
		if (this.engine === null) throw new Error('Not connected');
		if (this.engine.provider.connectionType === ConnectionType.HTTP) return;
		this.engine.provider.removeListener(STATUS.OPEN, this.initEchoApi);
		await this.engine.provider.reconnect();
		await this.initEchoApi();
		this.engine.provider.on(STATUS.OPEN, this.initEchoApi);
	}

	async disconnect() {
		if (this.engine === null) throw new Error('Not connected');
		if (this.engine.provider.connectionType === ConnectionType.WS) {
			this.subscriber.callCbOnDisconnect();
			this.subscriber.reset();
		}
		this.cache.reset();
		if (this.engine.provider.connectionType === ConnectionType.WS) await this.engine.provider.close();
		this.onOpen = null;
		this._isInitModules = false;
		if (this.engine.provider.connectionType === ConnectionType.WS) {
			this.engine.provider.removeListener(STATUS.OPEN, this.initEchoApi);
		}
	}

	/** @returns {Transaction} */
	createTransaction() { return new Transaction(this.api); }

}

export default Echo;

export const echo = new Echo();
