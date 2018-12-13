/* eslint-disable max-len */
import WebSocket from 'isomorphic-ws';

class ChainWebSocket {

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
     * @param url string - remote node address, should be (http|https|ws|wws)://(domain|ipv4|ipv6):port(?)/resource(?)?param=param(?).
     * @param options object - connection params.
     * @param options.connectionTimeout number - delay in ms between reconnection requests, default call delay before reject it.
     * @param options.maxRetries number - max count retries before close socket.
     * @param options.pingTimeout number - delay time in ms between ping request and socket disconnect.
     * @param options.pingInterval number - interval in ms between ping requests.
     * @param options.debug bool - debug mode status.
     * @returns {Promise}
     */
	connect(
	    url,
		options = {
			connectionTimeout: 5 * 1000,
			maxRetries: 0,
			pingTimeout: 15 * 1000,
			pingInterval: 15 * 1000,
			debug: false,
		},
	) {
		this._options = {
			connectionTimeout: options.connectionTimeout === undefined ? 5000 : options.connectionTimeout,
			maxRetries: options.maxRetries === undefined ? 0 : options.maxRetries,
			pingTimeout: options.pingTimeout === undefined ? 15 * 1000 : options.pingTimeout,
			pingInterval: options.pingInterval === undefined ? 15 * 1000 : options.pingInterval,
			debug: options.debug === undefined ? false : options.debug,
		};

		this.url = url;
		this._isFirstConnection = true;
		this._isForceClose = false;

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

				this._pingIntervalId = setInterval(() => { this._loginPing(); }, this._options.pingInterval);

				if (this._options.debug) {
					console.log('[ReconnectionWebSocket] >---- event ----->  ONOPEN');
				}
			};

			this.ws.onmessage = (message) => {
				this._listener(JSON.parse(message.data));

				if (this._options.debug) {
					console.log('[ReconnectionWebSocket] >---- event ----->  ONMESSAGE');
				}
			};

			this.ws.onclose = () => {
				if (this._isFirstConnection) {
					this._isFirstConnection = false;
					if (this._options.maxRetries === 0) reject(new Error('connection closed'));
				}

				const err = new Error('connection closed');
				for (let cbId = this._responseCbId + 1; cbId <= this._cbId; cbId += 1) {
					this._cbs[cbId].reject(err);
				}

				if (this._pingIntervalId) {
					clearInterval(this._pingIntervalId);
					this._pingIntervalId = null;
				}

				if (this.onClose) this.onClose();

				if (this._options.debug) {
					console.log('[ReconnectionWebSocket] >---- event ----->  ONCLOSE');
				}

				if (this._currentRetry >= this._options.maxRetries && !this._isForceClose) {
					this._isForceClose = true;
				    this.ws.close();
				    return;
				}

				setTimeout(() => {
				    this._connect().then(() => {}).catch(() => {});
				}, this._options.connectionTimeout);

			};

			this.ws.onerror = (error) => {

				if (this.onError) this.onError(error);

				if (this._options.debug) {
					console.log('[ReconnectionWebSocket] >---- event ----->  ONERROR');
				}
			};


		});
	}

	/**
     * connect to socket, can't be used after close
     */
	reconnect() {
		if (!this.ws) return;
		this._connect();
	}

	/**
     * set debug option
     * @param option
     */
	setDebugOption(status) {
		this._options.debug = Boolean(status);
	}

	/**
     * call a method with params via RPC
     * @param params
     * @returns {Promise}
     */
	call(params, timeout = this._options.connectionTimeout) {
		if (this.ws.readyState !== 1) {
			return Promise.reject(new Error(`websocket state error:${this.ws.readyState}`));
		}
		const method = params[1];
		if (this._options.debug) {
			console.log(`[ReconnectionWebSocket] >---- call ----->  "id":${this._cbId + 1}`, JSON.stringify(params));
		}

		this._cbId += 1;

		if (method === 'set_subscribe_callback' || method === 'subscribe_to_market' ||
            method === 'broadcast_transaction_with_callback' || method === 'set_pending_transaction_callback'
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
		        reject(new Error(`RPC call time is over Id: ${this._cbId}`));
		        if (this._cbs[this._cbId]) this._cbs[this._cbId].timeoutId = null;
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
	_listener(response) {
		if (this._options.debug) {
			console.log('[ReconnectionWebSocket] <---- reply ----<', JSON.stringify(response));
		}

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
			delete this._cbs[response.id];

			if (this._unsub[response.id]) {
				delete this._subs[this._unsub[response.id]];
				delete this._unsub[response.id];
			}

		} else if (callback && sub) {
			callback(response.params[1]);
		} else {
			console.log('Warning: unknown websocket response: ', response);
		}
	}

	/**
     * get access to chain
     * @param user
     * @param password
     * @returns {Promise}
     */
	login(user, password, timeout = this._options.connectionTimeout) {
		return this.call([1, 'login', [user, password]], timeout);
	}

	/**
     * make call for check connection
     */
	_loginPing() {
	    this.login('', '', this._options.pingTimeout)
			.then(() => {})
			.catch(() => { this.ws.close(); });
	}


	/**
     *
     * @returns {Promise}
     */
	close() {
		return new Promise((resolve) => {
			this.ws.onclose = () => {
				resolve();
				if (this.onClose) this.onClose();
			};
			this._isForceClose = true;
			this.ws.close();
		});
	}

}

export default ChainWebSocket;
