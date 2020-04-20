import WebSocket from 'isomorphic-ws';

import {
	CONNECTION_TIMEOUT,
	MAX_RETRIES,
	PING_TIMEOUT,
	PING_DELAY,
	DEBUG,
	CONNECTION_CLOSED_ERROR_MESSAGE,
} from '../../constants/ws-constants';

import { isVoid } from '../../utils/validators';

export default class ReconnectionWebSocket {

	get connected() { return this.ws && this.ws.readyState === WebSocket.OPEN; }

	constructor() {
		this.onOpen = null;
		this.onClose = null;
		this.onError = null;

		this._currentRetry = 0;
		this._pingDelayId = null;
		this._options = {};

		this._cbId = 0;
		this._responseCbId = 0;
		this._cbs = {};
		this._subs = [];
		this._unsub = {};
	}

	/**
	 * init params and connect to chain
	 *
	 * @param {string} url remote node address,
	 * should be (http|https|ws|wws)://(domain|ipv4|ipv6):port(?)/resource(?)?param=param(?).
	 *
	 * @param {Object} options connection params.
	 *
	 * @param {number} options.connectionTimeout
	 * delay in ms between reconnection requests, default call delay before reject it.
	 *
	 * @param {number} options.maxRetries - max count retries before close socket.
	 * @param {number} options.pingTimeout - delay time in ms between ping request and socket disconnect.
	 * @param {number} options.pingDelay - delay between last recived message and start checking connection.
	 * @param {boolean} options.debug - debug mode status.
	 * @returns {Promise<void>}
	 */
	async connect(url, options = {}) {
		if (this.connected) await this.close();
		this._options = {
			connectionTimeout: isVoid(options.connectionTimeout) ? CONNECTION_TIMEOUT : options.connectionTimeout,
			maxRetries: isVoid(options.maxRetries) ? MAX_RETRIES : options.maxRetries,
			pingTimeout: isVoid(options.pingTimeout) ? PING_TIMEOUT : options.pingTimeout,
			pingDelay: isVoid(options.pingDelay) ? PING_DELAY : options.pingDelay,
			debug: isVoid(options.debug) ? DEBUG : options.debug,
		};

		this.url = url;
		this._isFirstConnection = true;
		this._currentRetry = 0;
		this._forceClosePromise = null;
		this._reconnectionTimeoutId = null;

		this._cbId = 0;
		this._responseCbId = 0;
		this._cbs = {};
		this._cbLogs = [];
		this._subs = [];
		this._unsub = {};

		return this._connect();
	}

	/**
	 * inner connection method
	 * @returns {Promise<void>}
	 */
	_connect() {

		this._debugLog('[ReconnectionWebSocket] >---- retry _connect');

		this._currentRetry += 1;
		return new Promise((resolve, reject) => {
			let ws = null;
			try {
				ws = new WebSocket(this.url);
			} catch (error) {
				ws = null;
				if (this._isFirstConnection) {
					this._isFirstConnection = false;
					return reject(error);
				}
			}

			ws.onopen = () => {

				this._currentRetry = 0;

				if (this._isFirstConnection) {
					this._isFirstConnection = false;
					resolve();
				}

				if (this.onOpen) this.onOpen();

				this._setPingDelay();

				this._debugLog('[ReconnectionWebSocket] >---- event ----->  ONOPEN');
				return true;
			};

			ws.onmessage = (message) => {

				if (ws !== this.ws) {
					return false;
				}

				this._responseHandler(JSON.parse(message.data));

				this._debugLog('[ReconnectionWebSocket] >---- event ----->  ONMESSAGE');

				this._setPingDelay();

				return true;
			};

			ws.onclose = () => {

				if (ws !== this.ws) {
					return false;
				}

				if (this._isFirstConnection) {
					this._isFirstConnection = false;
					reject(new Error('Could\'t reach server or bad internet access'));
					return false;
				}

				this._forceClose();

				return true;

			};

			ws.onerror = (error) => {

				if (ws !== this.ws) {
					return false;
				}

				if (this.onError) this.onError(error);

				this._debugLog('[ReconnectionWebSocket] >---- event ----->  ONERROR');

				return true;
			};

			this.ws = ws;

			return ws;
		});
	}

	/**
	 * connect to socket, can't be used after close
	 * @returns {Promise}
	 */
	async reconnect() {
		if (!this.ws) {
			throw new Error('Socket not exist.');
		}

		this._debugLog('[ReconnectionWebSocket] >---- event ----->  FORCE RECONNECTING');
		await this.connect(this.url, this._options);
	}

	/**
	 * set debug option
	 * @param {Boolean} status
	 */
	setDebugOption(status) {
		this._options.debug = Boolean(status);
	}

	/**
	 * call a method with params via RPC
	 * @param {Array<any>} params
	 * @param {Number} timeout - timeout before reject
	 * @returns {Promise}
	 */
	call(params, timeout = this._options.connectionTimeout) {
		if (!this.ws) {
			return Promise.reject(new Error('Websocket is closed'));
		}

		if (this.ws.readyState !== WebSocket.OPEN) {
			return Promise.reject(new Error(`Websocket state error: ${this.ws.readyState}`));
		}

		const method = params[1];
		this._debugLog(`[ReconnectionWebSocket] >---- call ----->  "id":${this._cbId + 1}`, JSON.stringify(params));

		this._cbId += 1;

		if (
			method === 'set_subscribe_callback' ||
			method === 'broadcast_transaction_with_callback' ||
			method === 'set_pending_transaction_callback' ||
			method === 'set_block_applied_callback' ||
			method === 'set_consensus_message_callback' ||
			method === 'submit_registration_solution' ||
			method === 'get_contract_logs' ||
			method === 'subscribe_contract_logs' ||
			method === 'set_echorand_message_callback'
		) {
			this._subs[this._cbId] = { callback: params[2][0] };
			params[2][0] = this._cbId;
			if (method === 'get_contract_logs') {
				this._cbLogs.push(this._cbId);
			}
		} else if (method === 'unsubscribe_from_accounts') {
			if (typeof params[2][0] !== 'function') {
				throw new Error('First parameter of unsub must be the original callback');
			}

			const unSubCb = params[2].splice(0, 1)[0];

			this._subs.forEach((id) => {
				if (id.callback === unSubCb) {
					this._unsub[this._cbId] = id;
				}
			});
		}

		const request = {
			method: 'call',
			params,
		};
		request.id = this._cbId;

		return new Promise((resolve, reject) => {

			const timeoutId = setTimeout(() => {
				reject(new Error(`RPC call time is over Id: ${request.id}`));

				this._removePendingRequest(request.id);
			}, timeout);

			this._cbs[this._cbId] = {
				time: new Date(),
				resolve: method === 'subscribe_contract_logs' ? () => resolve(params[2][0]) : resolve,
				reject,
				timeoutId,
			};

			this.ws.send(JSON.stringify(request));
		});

	}

	/**
	 * message handler
	 * @param response
	 */
	_responseHandler(response) {
		this._debugLog('[ReconnectionWebSocket] <---- reply ----<', JSON.stringify(response));

		let sub = false;
		let callback = null;

		if (response.method === 'notice') {
			sub = true;
			response = {
				...response,
				id: response.params[0],
			};
		}

		if (!sub) {
			callback = this._cbs[response.id];
			this._responseCbId = response.id;
		} else if (this._subs[response.id].callback instanceof Array) {
			[callback] = this._subs[response.id].callback;
		} else if (typeof this._subs[response.id].callback === 'function') {
			// eslint-disable-next-line prefer-destructuring
			callback = this._subs[response.id].callback;
		}

		if (callback && !sub) {
			const { timeoutId } = callback;
			if (timeoutId) clearTimeout(timeoutId);
			if (response.error) {
				callback.reject(response.error);
			} else {
				callback.resolve(response.result);
			}

			this._removeSuccessfulRequest(response.id);

		} else if (callback && sub) {
			callback(response.params[1]);
			if (this._cbLogs.includes(response.id)) {
				delete this._subs[response.id];
				const indexCb = this._cbLogs.indexOf(response.id);
				this._cbLogs.splice(indexCb);
			}

		} else {
			this._debugLog('[ReconnectionWebSocket] >---- warning ---->   Unknown websocket response', response);
		}
	}

	/**
	 * get access to chain
	 * @param {String} user
	 * @param {String} password
	 * @param {Number} timeout - timeout before reject
	 * @returns {Promise}
	 */
	login(user, password, timeout = this._options.pingTimeout) {
		return this.call([1, 'login', [user, password]], timeout);
	}

	/**
	 * 	update ping delay timeout
	 *  @private
	 */
	_setPingDelay() {
		this._clearPingDelay();
		this._pingDelayId = setTimeout(() => this._ping(), this._options.pingDelay);
	}

	/**
	 * clear reconnection timeout
	 * @private
	 */
	_clearReconnectionTimeout() {
		if (this._reconnectionTimeoutId) {
			clearTimeout(this._reconnectionTimeoutId);
			this._reconnectionTimeoutId = null;
		}
	}

	/**
	 * 	clear ping delay timeout
	 *  @private
	 */
	_clearPingDelay() {
		if (this._pingDelayId) {
			clearTimeout(this._pingDelayId);
			this._pingDelayId = null;
		}
	}

	/**
	 * clear waiting calls
	 * @private
	 */
	_clearWaitingCallPromises() {
		const err = new Error(CONNECTION_CLOSED_ERROR_MESSAGE);

		for (let cbId = this._responseCbId + 1; cbId <= this._cbId; cbId += 1) {
			if (this._cbs[cbId]) this._cbs[cbId].reject(err);
		}
	}

	/**
	 * reset calls id
	 * @private
	 */
	_resetId() {
		this._cbId = 0;
	}

	/**
	 * make call for transaction.js connection
	 * @private
	 */
	async _ping() {
		try {
			await this.login();
		} catch (_) {
			if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
			this._forceClose();
		}
	}

	/**
	 * show debug logs
	 * @private
	 */
	_debugLog(...messages) {
		if (!this._options.debug) return;
		console.log(...messages);
	}

	/**
	 * remove pending request from map
	 * @private
	 */
	_removePendingRequest(id) {
		delete this._cbs[id];
		delete this._subs[id];
		delete this._unsub[id];
	}

	/**
	 * remove successful request from map
	 * @private
	 */
	_removeSuccessfulRequest(id) {
		delete this._cbs[id];

		if (this._unsub[id]) {
			delete this._subs[this._unsub[id]];
			delete this._unsub[id];
		}
	}

	_forceClose() {

		this._debugLog('[ReconnectionWebSocket] >---- _forceClose ');

		const { ws } = this;
		this.ws = null;

		if (ws) {
			ws.onopen = () => {};
			ws.onclose = () => {};
			ws.onerror = () => {};
			ws.onmessage = () => {};
			ws.close();
		}

		this._clearWaitingCallPromises();
		this._clearPingDelay();
		this._clearReconnectionTimeout();
		this._resetId();

		if (this.onClose && this._currentRetry === 0) this.onClose();

		this._debugLog('[ReconnectionWebSocket] >---- event ----->  ONCLOSE');

		if (this._forceClosePromise) {
			this._forceClosePromise();
			this._forceClosePromise = null;
			return true;
		}

		if (this._currentRetry >= this._options.maxRetries) {
			return true;
		}

		this._reconnectionTimeoutId = setTimeout(async () => {
			try {
				await this._connect();
			} catch (_) {
				//
			}
		}, this._options.connectionTimeout);

		return true;
	}
	/**
	 *
	 * @returns {Promise}
	 */
	close() {
		if (!this.ws || this.ws.readyState === WebSocket.CLOSING || this.ws.readyState === WebSocket.CLOSED) {
			return Promise.reject(new Error('Socket already close'));
		}

		return new Promise((resolve) => {
			this._forceClosePromise = resolve;
			this._forceClose();
		});
	}

}
