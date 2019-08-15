/* global window */
import EventEmitter from 'events';

import ReconnectionWebSocket from './reconnection-websocket';
import EchoApi from './echo-api';
import { validateUrl, validateOptionsError } from '../../utils/validators';
import { CHAIN_APIS, DEFAULT_CHAIN_APIS, STATUS } from '../../constants/ws-constants';

class WS extends EventEmitter {

	constructor(subscriber) {
		super();
		this._ws_rpc = new ReconnectionWebSocket(subscriber);

		this._connected = false;
		this._isFirstTime = true;

		this.onOpenCb = null;
		this.onCloseCb = null;
		this.onErrorCb = null;

		this._database = null;
		this._network_broadcast = null;
		this._history = null;
		this._registration = null;
		this._asset = null;
		this._login = null;
	}

	/**
	 *
	 * @private
	 */
	async _initEchoApi() {
		const initPromises = [];

		this.apis.forEach((api) => {
			if (api === 'login') initPromises.push((this._login.api_id = 1));
			else initPromises.push(this[`_${api}`].init());
		});

		try {
			await Promise.all(initPromises);
			await this._ws_rpc.login('', '');
		} catch (e) {
			console.error('[WS] >---- error ----->  ONOPEN', e);
			await this.close();
		}
	}

	/**
	 * On open callback
	*/
	_onOpen() {
		if (!this._ws_rpc) return;

		this._connected = true;

		if (this._isFirstTime) {
			this._isFirstTime = false;
		}

		if (this.onOpenCb) this.onOpenCb('open');
		this.emit(STATUS.OPEN);

	}

	/**
	 * On close callback
	 */
	_onClose() {
		if (this._isFirstTime) this._isFirstTime = false;
		this._connected = false;
		if (this.onCloseCb) this.onCloseCb('close');

		this.emit(STATUS.CLOSE);
	}

	/**
	 * On error callback
	 * @param error
	 */
	_onError(error) {
		if (this.onErrorCb) this.onErrorCb('error', error);
		this.emit(STATUS.ERROR);
	}

	/**
	 * init params and connect to chain
	 * @param {String} url - remote node address,
	 * should be (http|https|ws|wws)://(domain|ipv4|ipv6):port(?)/resource(?)?param=param(?).
	 * @param {Object} options - connection params.
	 * @param {Number} options.connectionTimeout - delay in ms between reconnection requests,
	 * 		default call delay before reject it.
	 * @param {Number} options.maxRetries - max count retries before close socket.
	 * @param {Number} options.pingTimeout - delay time in ms between ping request
	 * 		and socket disconnect.
	 * @param {Number} options.pingDelay - delay between last recived message and start checking connection.
	 * @param {Boolean} options.debug - debug mode status.
	 * @returns {Promise}
	 */
	async connect(url, options = {}) {
		if (!validateUrl(url)) throw new Error(`Invalid address ${url}`);

		if (
			typeof window !== 'undefined' &&
			window.location &&
			window.location.protocol === 'https:' &&
			url.indexOf('wss://') < 0
		) {
			throw new Error('Secure domains require wss connection');
		}

		const optionError = validateOptionsError(options);

		if (optionError) throw new Error(optionError);

		this.url = url;

		this.options = {
			connectionTimeout: options.connectionTimeout,
			maxRetries: options.maxRetries,
			pingTimeout: options.pingTimeout,
			pingDelay: options.pingDelay,
			debug: options.debug,
		};

		this.apis = options.apis || DEFAULT_CHAIN_APIS;
		this._connected = false;
		this._isFirstTime = true;

		if (options.onOpen && typeof options.onOpen === 'function') this.onOpenCb = options.onOpen;
		if (options.onClose && typeof options.onClose === 'function') this.onCloseCb = options.onClose;
		if (options.onError && typeof options.onError === 'function') this.onErrorCb = options.onError;

		if (!this._ws_rpc) this._ws_rpc = new ReconnectionWebSocket();

		this._ws_rpc.onOpen = () => this._onOpen();
		this._ws_rpc.onClose = () => this._onClose();
		this._ws_rpc.onError = () => this._onError();

		CHAIN_APIS.forEach((api) => { this[`_${api}`] = new EchoApi(this._ws_rpc, api); });

		try {
			await this._ws_rpc.connect(url, this.options);
			await this._initEchoApi();
		} catch (err) {
			throw err;
		}
	}

	/**
	 * Reconnect to chain, can't be used after close
	 * @returns {Promise}
	 */
	async reconnect() {
		if (!this._ws_rpc) throw new Error('Socket close.');

		await this._initEchoApi();
		const reconnectResult = await this._ws_rpc.reconnect();
		return reconnectResult;
	}

	/**
	 * Close socket, delete subscribers
	 * @returns {Promise}
	 */
	async close() {
		if (this._ws_rpc && this._ws_rpc.ws) {
			try {
				await this._ws_rpc.close();
			} catch (error) {
				throw error;
			}
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
	 * @returns {EchoApi}
	 */
	dbApi() {
		return this._database;
	}

	/**
	 * network API
	 * @returns {EchoApi}
	 */
	networkApi() {
		return this._network_broadcast;
	}

	/**
	 * history API
	 * @returns {EchoApi}
	 */
	historyApi() {
		return this._history;
	}

	/**
	 * registration API
	 * @returns {EchoApi}
	 */
	registrationApi() {
		return this._registration;
	}

	/**
	 * asset API
	 * @returns {EchoApi}
	 */
	assetApi() {
		return this._asset;
	}

	/**
	 * login API
	 * @returns {EchoApi}
	 */
	loginApi() {
		return this._login;
	}

	/**
	 * network node API
	 * @returns {EchoApi}
	 */
	networkNodeApi() {
		return this._network_node;
	}

}

export default WS;
