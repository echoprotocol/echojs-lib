import WebSocket from 'isomorphic-ws';

class ChainWebSocket {

	constructor() {
		this.debug = false;

		this.onOpen = null;
		this.onClose = null;
		this.onError = null;

		this.currentRetry = 0;
		this.pingIntervalId = null;
		this.options = {};

		this.cbId = 0;
		this.responseCbId = 0;
		this.cbs = {};
		this.subs = [];
		this.unsub = {};
	}

	/**
     *
     * @param url
     * @param options
     * @returns {Promise}
     */
	connect(url, options = {
	    connectionTimeout: 5 * 1000,
		maxRetries: 0,
		pingTimeout: 15 * 1000,
		pingInterval: 15 * 1000,
		debug: false,
	}) {
	    this.options = {
			connectionTimeout: options.connectionTimeout === undefined ? 5000 : options.connectionTimeout,
			maxRetries: options.maxRetries === undefined ? options.maxRetries : 0,
			pingTimeout: options.pingTimeout === undefined ? options.pingTimeout : 15 * 1000,
			pingInterval: options.pingInterval === undefined ? options.pingInterval : 15 * 1000,
			debug: options.debug === undefined ? false : options.debug,
		};

		this.url = url;
		this.options = options;
		this.isFirstConnection = true;

		return this._connect();
	}

	/**
     * inner connection method
     * @param url
     * @param options
     * @returns {Promise}
     */
	_connect() {
	    return new Promise((resolve, reject) => {
			try {
				this.ws = new WebSocket(this.url);
			} catch (error) {
				this.ws = null;
				if (this.isFirstConnection) {
					this.isFirstConnection = false;
					reject(error);
					return;
				}
			}

			this.ws.onopen = () => {

				this.currentRetry = 0;

				if (this.isFirstConnection) {
					this.isFirstConnection = false;
					resolve();
				}

				if (this.onOpen) this.onOpen();

				this.pingIntervalId = setInterval(() => { this.loginPing(); }, this.options.pingInterval);

				if (this.options.debug) {
					console.log('[ReconnectionWebSocket] >---- event ----->  ONOPEN');
				}
			};

			this.ws.onmessage = (message) => {
				this.listener(JSON.parse(message.data));

				if (this.options.debug) {
					console.log('[ReconnectionWebSocket] >---- event ----->  ONMESSAGE');
				}
			};

			this.ws.onclose = () => {
				if (this.isFirstConnection) {
					this.isFirstConnection = false;
					if (this.options.maxRetries === 0) reject(new Error('connection closed'));
				}

				const err = new Error('connection closed');
				for (let cbId = this.responseCbId + 1; cbId <= this.cbId; cbId += 1) {
					this.cbs[cbId].reject(err);
				}

				if (this.pingIntervalId) {
					clearInterval(this.pingIntervalId);
					this.pingIntervalId = null;
				}

				if (this.onClose) this.onClose();

				if (this.options.debug) {
					console.log('[ReconnectionWebSocket] >---- event ----->  ONCLOSE');
				}

				if (this.currentRetry > this.options.maxRetries) return;

				setTimeout(() => {
				    this._connect().then(() => {}).catch(() => {});
				}, this.options.connectionTimeout);

			};

			this.ws.onerror = (error) => {

				if (this.onError) this.onError(error);

				if (this.options.debug) {
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
		this.options.debug = Boolean(status);
	}

	/**
     * call a method with params via RPC
     * @param params
     * @returns {Promise}
     */
	call(params, timeout = this.options.connectionTimeout) {
		if (this.ws.readyState !== 1) {
			return Promise.reject(new Error(`websocket state error:${this.ws.readyState}`));
		}
		const method = params[1];
		if (this.options.debug) {
			console.log(`[ReconnectionWebSocket] >---- call ----->  "id":${this.cbId + 1}`, JSON.stringify(params));
		}

		this.cbId += 1;

		if (method === 'set_subscribe_callback' || method === 'subscribe_to_market' ||
            method === 'broadcast_transaction_with_callback' || method === 'set_pending_transaction_callback'
		) {
			// Store callback in subs map
			this.subs[this.cbId] = {
				callback: params[2][0],
			};

			// Replace callback with the callback id
			params[2][0] = this.cbId;
		}

		if (method === 'unsubscribe_from_market' || method === 'unsubscribe_from_accounts') {
			if (typeof params[2][0] !== 'function') {
				throw new Error('First parameter of unsub must be the original callback');
			}

			const unSubCb = params[2].splice(0, 1)[0];

			this.subs.forEach((id) => {
				if (id.callback === unSubCb) {
					this.unsub[this.cbId] = id;
				}
			});
		}

		const request = {
			method: 'call',
			params,
		};
		request.id = this.cbId;

		return new Promise((resolve, reject) => {

		    const timeoutId = setTimeout(() => {
		        reject(new Error(`RPC call time is over Id: ${this.cbId}`));
		        if (this.cbs[this.cbId]) this.cbs[this.cbId].timeoutId = null;
			}, timeout);

			this.cbs[this.cbId] = {
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
	listener(response) {
		if (this.options.debug) {
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
			callback = this.cbs[response.id];
			this.responseCbId = response.id;
		} else if (this.subs[response.id].callback instanceof Array) {
			[callback] = this.subs[response.id].callback;
		} else if (typeof this.subs[response.id].callback === 'function') {
			// eslint-disable-next-line prefer-destructuring
			callback = this.subs[response.id].callback;
		}

		if (callback && !sub) {
			const { timeoutId } = callback;
			if (timeoutId) clearTimeout(timeoutId);
			if (response.error) {
				callback.reject(response.error);
			} else {
				callback.resolve(response.result);
			}
			delete this.cbs[response.id];

			if (this.unsub[response.id]) {
				delete this.subs[this.unsub[response.id]];
				delete this.unsub[response.id];
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
	login(user, password, timeout = this.options.connectionTimeout) {
		return this.call([1, 'login', [user, password]], timeout);
	}

	/**
     * make call for check connection
     */
	loginPing() {
	    this.login('', '', this.options.pingTimeout)
			.then(() => {})
			.catch(() => { this.ws.close(); });
	}


	/**
     *
     * @returns {Promise}
     */
	close() {
		return new Promise((resolve) => {
			this.ws.onclose = () => resolve();
			this.ws.close();
		});
	}

}

export default ChainWebSocket;
