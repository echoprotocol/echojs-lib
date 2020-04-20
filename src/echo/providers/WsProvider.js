import { EventEmitter } from 'events';
import * as ConnectionType from './connection-types';
import ReconnectionWebSocket from './reconnection-websocket';
import { DEFAULT_CHAIN_APIS, STATUS } from '../../constants/ws-constants';

export default class WsProvider extends EventEmitter {

	get connected() { return this._ws_rpc.connected; }
	get connectionType() { return ConnectionType.WS; }

	constructor() {
		super();

		this._ws_rpc = new ReconnectionWebSocket();

		this._connected = false;
		this._isFirstTime = true;

		this.onOpenCb = null;
		this.onCloseCb = null;
		this.onErrorCb = null;
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

		await this._ws_rpc.connect(url, this.options);
	}

	call(params, timeout = this.options.connectionTimeout) {
		return this._ws_rpc.call(params, timeout);
	}

	/**
	 * Reconnect to chain, can't be used after close
	 * @returns {Promise}
	 */
	async reconnect() {
		if (!this._ws_rpc) throw new Error('Socket close.');

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

}
