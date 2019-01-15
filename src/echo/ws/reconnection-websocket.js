/* eslint-disable max-len,no-empty */
import WebSocket from 'isomorphic-ws';

import {
	CONNECTION_TIMEOUT,
	MAX_RETRIES,
	PING_TIMEOUT,
	PING_INTERVAL,
	DEBUG,
} from '../../constants/ws-constants';

class ReconnectionWebSocket {

	constructor() {
		this.onOpen = null;
		this.onClose = null;
		this.onError = null;

		this._currentRetry = 0;
		this._pingIntervalId = null;
		this._options = {};

		this._cbId = 0;
		this._responseCbId = 0;
		this._cbs = {};
		this._subs = [];
		this._unsub = {};
	}

	/**
	 * init params and connect to chain
	 * @param {String} url - remote node address,
	 * should be (http|https|ws|wws)://(domain|ipv4|ipv6):port(?)/resource(?)?param=param(?).
	 * @param {Object} options - connection params.
	 * @param {Number} options.connectionTimeout - delay in ms between reconnection requests, default call delay before reject it.
	 * @param {Number} options.maxRetries - max count retries before close socket.
	 * @param {Number} options.pingTimeout - delay time in ms between ping request and socket disconnect.
	 * @param {Number} options.pingInterval - interval in ms between ping requests.
	 * @param {Boolean} options.debug - debug mode status.
	 * @returns {Promise}
	 */
	async connect(
		url,
		options = {},
	) {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			try {
				await this.close();
			} catch (error) {
				throw error;
			}
		}

		this._options = {
			connectionTimeout: typeof options.connectionTimeout === 'undefined' ?
				CONNECTION_TIMEOUT : options.connectionTimeout,
			maxRetries: typeof options.maxRetries === 'undefined' ? MAX_RETRIES : options.maxRetries,
			pingTimeout: typeof options.pingTimeout === 'undefined' ? PING_TIMEOUT : options.pingTimeout,
			pingInterval: typeof options.pingInterval === 'undefined' ? PING_INTERVAL : options.pingInterval,
			debug: typeof options.debug === 'undefined' ? DEBUG : options.debug,
		};

		this.url = url;
		this._isFirstConnection = true;
		this._isForceClose = false;
		this._currentRetry = 0;
		this._forceClosePromise = null;
		this._reconnectionTimeoutId = null;

		this._cbId = 0;
		this._responseCbId = 0;
		this._cbs = {};
		this._subs = [];
		this._unsub = {};

		return this._connect();
	}

	/**
	 * inner connection method
	 * @returns {Promise}
	 */
	_connect() {
		this._currentRetry += 1;
		return new Promise((resolve, reject) => {
			try {
				this.ws = new WebSocket(this.url);
			} catch (error) {
				this.ws = null;
				if (this._isFirstConnection) {
					this._isFirstConnection = false;
					reject(error);
					return;
				}
			}

			this.ws.onopen = () => {
				this._currentRetry = 0;

				if (this._isFirstConnection) {
					this._isFirstConnection = false;
					resolve();
				}

				if (this.onOpen) this.onOpen();

				this._clearPingInterval();

				this._pingIntervalId = setInterval(() => this._loginPing(), this._options.pingInterval);

				this._debugLog('[ReconnectionWebSocket] >---- event ----->  ONOPEN');
			};

			this.ws.onmessage = (message) => {
				this._responseHandler(JSON.parse(message.data));

				this._debugLog('[ReconnectionWebSocket] >---- event ----->  ONMESSAGE');
			};

			this.ws.onclose = () => {
				if (this._isFirstConnection) {
					this._isFirstConnection = false;
					if (this._options.maxRetries === 0) reject(new Error('connection closed'));
				}

				this._clearWaitingCallPromises();
				this._clearPingInterval();
				this._clearReconnectionTimeout();

				if (this.onClose) this.onClose();

				this._debugLog('[ReconnectionWebSocket] >---- event ----->  ONCLOSE');

				if (this._forceClosePromise) {
					this._forceClosePromise();
					this._forceClosePromise = null;
					return;
				}

				if (this._currentRetry >= this._options.maxRetries && !this._isForceClose) {
					this._isForceClose = true;
					this.ws.close();
					return;
				}

				this._reconnectionTimeoutId = setTimeout(async () => {
					try {
						await this._connect();
					} catch (_) {
						//
					}
				}, this._options.connectionTimeout);

			};

			this.ws.onerror = (error) => {

				if (this.onError) this.onError(error);

				this._debugLog('[ReconnectionWebSocket] >---- event ----->  ONERROR');
			};


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
		if (this.ws.readyState !== WebSocket.OPEN) {
			return Promise.reject(new Error(`websocket state error: ${this.ws.readyState}`));
		}
		const method = params[1];
		this._debugLog(`[ReconnectionWebSocket] >---- call ----->  "id":${this._cbId + 1}`, JSON.stringify(params));

		this._cbId += 1;

		if (method === 'set_subscribe_callback' || method === 'subscribe_to_market' ||
			method === 'broadcast_transaction_with_callback' || method === 'set_pending_transaction_callback' ||
			method === 'set_block_applied_callback' || method === 'set_consensus_message_callback'
		) {
			// Store callback in subs map
			this._subs[this._cbId] = {
				callback: params[2][0],
			};

			// Replace callback with the callback id
			params[2][0] = this._cbId;
		}

		if (method === 'unsubscribe_from_market' || method === 'unsubscribe_from_accounts') {
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
				resolve,
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
		} else {
			console.log('[ReconnectionWebSocket] >---- warning ---->   Unknown websocket response', response);
		}
	}

	/**
	 * get access to chain
	 * @param {String} user
	 * @param {String} password
	 * @param {Number} timeout - timeout before reject
	 * @returns {Promise}
	 */
	login(user, password, timeout = this._options.connectionTimeout) {
		return this.call([1, 'login', [user, password]], timeout);
	}

	/**
	 * clear ping interval
	 * @private
	 */
	_clearPingInterval() {
		if (this._pingIntervalId) {
			clearInterval(this._pingIntervalId);
			this._pingIntervalId = null;
		}
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
	 * clear waiting calls
	 * @private
	 */
	_clearWaitingCallPromises() {
		const err = new Error('connection closed');

		for (let cbId = this._responseCbId + 1; cbId <= this._cbId; cbId += 1) {
			if (this._cbs[cbId]) this._cbs[cbId].reject(err);
		}
	}

	/**
	 * make call for check connection
	 */
	async _loginPing() {
		try {
			await this.login('', '', this._options.pingTimeout);
		} catch (_) {
			if (this.ws.readyState !== WebSocket.OPEN) return;
			this.ws.close();
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


	/**
	 *
	 * @returns {Promise}
	 */
	close() {
		if (this.ws.readyState === WebSocket.CLOSING || this.ws.readyState === WebSocket.CLOSED) {
			return Promise.reject(new Error('Socket already close'));
		}

		return new Promise((resolve) => {
			this._forceClosePromise = resolve;
			this._isForceClose = true;
			this.ws.close();
		});
	}

}

export default ReconnectionWebSocket;
