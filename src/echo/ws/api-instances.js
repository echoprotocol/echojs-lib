import ChainWebSocket from './reconnection-websocket';
import GrapheneApi from './graphene-api';
import { validateUrl } from '../../utils/validator';

class ApisInstance {

	constructor() {
		this._ws_rpc = new ChainWebSocket();

		this.onOpenCb = null;
		this.onCloseCb = null;
		this.onErrorCb = null;
	}

	/**
     * On open callback
     */
	onOpen() {
		if (!this._ws_rpc) return;

		const initPromises = [
			this._db.init(),
			this._net.init(),
			this._hist.init(),
			// this._reg.init(),
			// this._asset.init(),
		];

		this._ws_rpc.login('', '')
			.then(() => Promise.all(initPromises))
			.then(() => {
				if (this.onOpenCb) this.onOpenCb('open');
			});

	}

	/**
	 * On close callback
     */
	onClose() {
		if (this.onCloseCb) this.onCloseCb('close');
	}

	/**
	 * On error callback
     * @param error
     */
	onError(error) {
		if (this.onErrorCb) this.onErrorCb('error', error);
	}

	/**
	 * connect to chain
     * @param url
     * @param options
     * @returns {Promise}
     */
	async connect(url, options) {
		if (!validateUrl(url)) throw new Error(`Invalid address ${url}`);

		if (typeof window !== 'undefined' && window.location && window.location.protocol === 'https:' && url.indexOf('wss://') < 0) {
			throw new Error('Secure domains require wss connection');
		}

		this.url = url;
		this.options = {
			connectionTimeout: Number.isInteger(Number(options.connectionTimeout)) ?
				Number(options.connectionTimeout) : undefined,
			maxRetries: Number.isInteger(Number(options.maxRetries)) ?
				Number(options.maxRetries) : undefined,
			pingTimeout: Number.isInteger(Number(options.pingTimeout)) ?
				Number(options.pingTimeout) : undefined,
			pingInterval: Number.isInteger(Number(options.pingInterval)) ?
				Number(options.pingInterval) : undefined,
			debug: options.debug ?
				Boolean(options.debug) : undefined,
		};

		this.options = options;

		if (options && typeof options === 'object') {
			if (options.onOpen && typeof options.onOpen === 'function') this.onOpenCb = options.onOpen;
			if (options.onClose && typeof options.onClose === 'function') this.onCloseCb = options.onClose;
			if (options.onError && typeof options.onError === 'function') this.onErrorCb = options.onError;
		}

		this._ws_rpc.onOpen = () => { this.onOpen(); };
		this._ws_rpc.onClose = () => { this.onClose(); };
		this._ws_rpc.onError = () => { this.onError(); };

		this._db = new GrapheneApi(this._ws_rpc, 'database');
		this._net = new GrapheneApi(this._ws_rpc, 'network_broadcast');
		this._hist = new GrapheneApi(this._ws_rpc, 'history');
		this._reg = new GrapheneApi(this._ws_rpc, 'registration');
		this._asset = new GrapheneApi(this._ws_rpc, 'asset');


		try {
			await this._ws_rpc.connect(url, this.options);
		} catch (err) {
			console.error(url, 'Failed to initialize with error', err && err.message);
			await this.close();
			throw err;
		}
	}

	/**
	 * Reconnect to chain, can't be used after close
     */
	reconnect() {
		if (!this._ws_rpc) return;
		this._ws_rpc.reconnect();
	}

	/**
	 * Close socket, delete subscribers
     * @returns {Promise}
     */
	async close() {
		if (this._ws_rpc && this._ws_rpc.ws && this._ws_rpc.ws.readyState === 1) {
			await this._ws_rpc.close();
		}
		this._ws_rpc = null;
	}

	/**
	 * Set debug option
     * @param status
     */
	setDebugOption(status) {
		this._ws_rpc.setDebugOption(status);
	}

	/**
	 * database API
     * @returns {GrapheneApi}
     */
	dbApi() {
		return this._db;
	}

	/**
	 * network API
     * @returns {GrapheneApi}
     */
	networkApi() {
		return this._net;
	}

	/**
	 * history API
     * @returns {GrapheneApi}
     */
	historyApi() {
		return this._hist;
	}

	/**
	 * registration API
     * @returns {GrapheneApi}
     */
	registrationApi() {
		return this._reg;
	}

	/**
	 * asset API
     * @returns {GrapheneApi}
     */
	assetApi() {
		return this._asset;
	}

}

export default ApisInstance;
