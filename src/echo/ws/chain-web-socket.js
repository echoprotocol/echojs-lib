import RWS from 'reconnecting-websocket';
import WS from 'ws';

let WebSocketClient;

if (typeof WebSocket === 'undefined') {
	WebSocketClient = WS;
} else {
	WebSocketClient = WebSocket;
}

class ChainWebSocket {

	constructor() {
		this.socketDebug = false;

		this.onOpen = null;
		this.onClose = null;
		this.onError = null;
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
	async connect(
		url,
		options = { connectionTimeout: 5000, maxRetries: 0 },
	) {

		this.socketDebug = options.socketDebug;
		this.url = url;

		return new Promise((resolve, reject) => {
			let isFirstConnection = true;
			try {
				this.ws = new RWS(this.url, [], { maxRetries: 5, WebSocket: WebSocketClient });
			} catch (error) {
				this.ws = null;
				reject(error);
			}

			this.ws.addEventListener('open', () => {

                if (this.onOpen) this.onOpen();
                if (isFirstConnection) {
                    isFirstConnection = false;
                    resolve();
                }

                if (this.onOpen) this.onOpen();
				console.log('open event addEventListener');
			});

			this.ws.addEventListener('message', (message) => {
				console.log('message event addEventListener');

                this.listener(JSON.parse(message.data));


            });

			this.ws.addEventListener('close', () => {
                if (isFirstConnection) {
                    isFirstConnection = false;
                    if (options.maxRetries === 0) reject(new Error('connection closed'));
                }

                if (this.onClose) this.onClose();
                const err = new Error('connection closed');
                for (let cbId = this.responseCbId + 1; cbId <= this.cbId; cbId += 1) {
                    this.cbs[cbId].reject(err);
                }
				console.log('close event addEventListener');
			})
			this.ws.addEventListener('error', (error) => {

                if (this.onError) this.onError(error);

				console.log('error event addEventListener');
			})


		});
	}

	/**
	 *
     */
	reconnect() {
		if (!this.ws) return;
		this.ws.reconnect();
	}

	/**
	 *
     * @param option
     */
	setDebugOption(option) {
		this.socketDebug = Boolean(option);
	}

	/**
	 *
     * @param params
     * @returns {Promise}
     */
	call(params) {
		if (this.ws.readyState !== 1) {
			return Promise.reject(new Error(`websocket state error:${this.ws.readyState}`));
		}
		const method = params[1];
		if (this.socketDebug) {
			console.log(`[ChainWebSocket] >---- call ----->  "id":${this.cbId + 1}`, JSON.stringify(params));
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
			this.cbs[this.cbId] = {
				time: new Date(),
				resolve,
				reject,
			};
			this.ws.send(JSON.stringify(request));
		});

	}

	/**
	 *
     * @param response
     */
	listener(response) {
		if (this.socketDebug) {
			console.log('[ChainWebSocket] <---- reply ----<', JSON.stringify(response));
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
	 *
     * @param user
     * @param password
     * @returns {Promise}
     */
	login(user, password) {
		return this.call([1, 'login', [user, password]]);
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
