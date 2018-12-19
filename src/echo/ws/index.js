/* eslint-disable max-len */
import ReconnectionWebSocket from './reconnection-websocket';
import GrapheneApi from './graphene-api';
import { validateUrl } from '../../utils/validator';
import { CHAIN_APIS, DEFAULT_CHAIN_APIS } from '../../constants/ws-constants';

class ApisInstance {

	constructor() {
		this._ws_rpc = new ReconnectionWebSocket();

		this._connected = false;

		this.onOpenCb = null;
		this.onCloseCb = null;
		this.onErrorCb = null;
	}

	/**
     * On open callback
     */
	async _onOpen() {
		if (!this._ws_rpc) return;


		const initPromises = [];

		this.apis.forEach((api) => {
			switch (api) {
				case 'database':
					initPromises.push(this._db.init());
					break;
                case 'login':
                    this._login.api_id = 1;
                    break;
                case 'network_broadcast':
                    initPromises.push(this._net.init());
                    break;
                case 'history':
                    initPromises.push(this._hist.init());
                    break;
                case 'registration':
                    initPromises.push(this._reg.init());
                    break;
                case 'asset':
                    initPromises.push(this._asset.init());
                    break;
			}
		})

		try {
            await this._ws_rpc.login('', '');
            await Promise.all(initPromises);
            this._connected = true;
            if (this.onOpenCb) this.onOpenCb('open');
		} catch (e) {
			console.error('[ApisInstance] >---- error ----->  ONOPEN', e)
		}
	}

	/**
     * On close callback
     */
	_onClose() {
		this._connected = false;
		if (this.onCloseCb) this.onCloseCb('close');
	}

	/**
     * On error callback
     * @param error
     */
	_onError(error) {
		if (this.onErrorCb) this.onErrorCb('error', error);
	}

	/**
     * init params and connect to chain
     * @param {String} url - remote node address, should be (http|https|ws|wws)://(domain|ipv4|ipv6):port(?)/resource(?)?param=param(?).
     * @param {Object} options - connection params.
     * @param {Number} options.connectionTimeout - delay in ms between reconnection requests, default call delay before reject it.
     * @param {Number} options.maxRetries - max count retries before close socket.
     * @param {Number} options.pingTimeout - delay time in ms between ping request and socket disconnect.
     * @param {Number} options.pingInterval - interval in ms between ping requests.
     * @param {Boolean} options.debug - debug mode status.
     * @returns {Promise}
     */
	async connect(url, options = {}) {
		if (!validateUrl(url)) throw new Error(`Invalid address ${url}`);

		if (typeof window !== 'undefined' && window.location && window.location.protocol === 'https:' && url.indexOf('wss://') < 0) {
			throw new Error('Secure domains require wss connection');
		}

		if (!options || typeof options !== 'object') throw new Error('Options should be an object');

		let errorParameter;
		if (!(Number.isInteger(options.connectionTimeout) || typeof options.connectionTimeout === 'undefined')) {
			errorParameter = 'connectionTimeout';
		} else if (!(Number.isInteger(options.maxRetries) || typeof options.maxRetries === 'undefined')) {
            errorParameter = 'maxRetries';
        } else if (!(Number.isInteger(options.pingTimeout) || typeof options.pingTimeout === 'undefined')) {
            errorParameter = 'pingTimeout';
        } else if (!(Number.isInteger(options.pingInterval) || typeof options.pingInterval === 'undefined')) {
            errorParameter = 'pingInterval';
        } else if (!(typeof options.debug === 'boolean' || typeof options.debug === 'undefined')) {
            errorParameter = 'debug';
        } else if (!((Array.isArray(options.apis) && options.apis.every((api) => CHAIN_APIS.includes(api))) || typeof options.apis === 'undefined')) {
            errorParameter = 'apis';
        }

		if (errorParameter) throw new Error(`Parameter ${errorParameter} is invalid`);

		this.url = url;
		
		this.options = {
			connectionTimeout: options.connectionTimeout,
			maxRetries: options.maxRetries,
			pingTimeout: options.pingTimeout,
			pingInterval: options.pingInterval,
			debug: options.debug,
		};

		this.apis = options.apis || DEFAULT_CHAIN_APIS;

		if (options.onOpen && typeof options.onOpen === 'function') this.onOpenCb = options.onOpen;
		if (options.onClose && typeof options.onClose === 'function') this.onCloseCb = options.onClose;
		if (options.onError && typeof options.onError === 'function') this.onErrorCb = options.onError;

		if (!this._ws_rpc) this._ws_rpc = new ReconnectionWebSocket();

		this._ws_rpc.onOpen = () => this._onOpen();
		this._ws_rpc.onClose = () => this._onClose();
		this._ws_rpc.onError = () => this._onError();

		this._db = new GrapheneApi(this._ws_rpc, 'database');
		this._net = new GrapheneApi(this._ws_rpc, 'network_broadcast');
		this._hist = new GrapheneApi(this._ws_rpc, 'history');
		this._reg = new GrapheneApi(this._ws_rpc, 'registration');
		this._asset = new GrapheneApi(this._ws_rpc, 'asset');
		this._login = new GrapheneApi(this._ws_rpc, 'login');

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
     * @returns {Promise}
     */
	reconnect() {
		if (!this._ws_rpc) throw new Error('Socket close.');
		return this._ws_rpc.reconnect();
	}

	/**
     * Close socket, delete subscribers
     * @returns {Promise}
     */
	async close() {
		if (this._ws_rpc && this._ws_rpc.ws && this._ws_rpc.ws.readyState === 1) {
			await this._ws_rpc.close();
			this._ws_rpc = null;
		}
	}

	/**
     * Set debug option
     * @param {Boolean} status
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

	/**
     * login API
     * @returns {GrapheneApi}
     */
	loginApi() {
		return this._login;
	}

}

export default ApisInstance;
