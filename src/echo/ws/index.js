import { ok } from 'assert';
import { EventEmitter } from 'events';
import WebSocket from 'isomorphic-ws';
import { inspect } from 'util';
import * as WS_CONSTANTS from '../../constants/ws-constants';
import EchoApi from './echo-api';

/** @typedef {import('../../constants/ws-constants').ChainApi} ChainApi */

export const ErrorCode = {
	INVALID_API_NAME: 5001,
	FORCE_DISCONNECT: 5002,
	NOT_CONNECTED: 5003,
	DISCONNECTED: 5004,
	UNEXPECTED_RESPONSE_TYPE: 5005,
	UNEXPECTED_RESPONSE_ID_TYPE: 5006,
	UNEXPECTED_RESPONSE_ID: 5007,
	NOTICE_PARAMS_IS_NOT_AN_ARRAY: 5008,
	UNEXPECTED_NOTICE_PARAMS_LENGTH: 5009,
	UNEXPECTED_NOTICE_CALLBACK_ID: 5010,
};

export class ReconnectionWebSocketError extends Error {

	get name() { return 'ReconnectionWebSocketError'; }

	/**
	 * @param {number} code
	 * @param {string} reason
	 * @param {any} [data]
	 */
	constructor(code, reason, data) {
		super(`ws closed with code ${code} and reason "${reason}"`);
		this.code = code;
		this.reason = reason;
		this.data = data;
	}

}

export class ReconnectionWebSocketDebugger {

	/** @param {boolean} options */
	constructor(options) {
		this.options = options;
	}

	call(data) {
		if (this.options) console.log(`[ReconnectionWebSocket] >--- call ----> ${JSON.stringify(data)}`);
	}

	reply(data) {
		if (this.options) console.log(`[ReconnectionWebSocket] <--- reply ---< ${JSON.stringify(data)}`);
	}

	log(data) {
		if (this.options) {
			const message = typeof data === 'string' ? data : JSON.stringify(data);
			console.log(`[ReconnectionWebSocket] --------------- ${message}`);
		}
	}

	event(data) {
		if (this.options) {
			const event = typeof data === 'string' ? data : JSON.stringify(data);
			console.log(`[ReconnectionWebSocket] >--- event ---> ${event}`);
		}
	}

}

/**
 * @typedef {Object} Options
 * @property {number} [connectionTimeout]
 * @property {number} [maxRetries]
 * @property {number} [pingTimeout]
 * @property {number} [pingDelay]
 * @property {boolean} [debug]
 * @property {ChainApi[]} [apis]
 */

/**
 * @typedef {Object} Call
 * @property {(result: any) => any} resolve
 * @property {(error: any) => any} reject
 * @property {ChainApi} api
 * @property {string} method
 * @property {any} params
 * @property {NodeJS.Timeout | null} callTimeout
 * @property {NodeJS.Timeout | null} rejectTimeout
 */

/**
 * @typedef {Object} Subscriber
 * @property {ChainApi} api
 * @property {string} method
 * @property {any} params
 * @property {(data: any) => any} resolver
 * @property {boolean} inited
 */

/**
 * @param {number} num
 * @returns {number}
 */
function safeUnsignedInteger(num, field) {
	ok(Number.isSafeInteger(num), `${field} is not a safe integer`);
	ok(num >= 0, `${field} is negative`);
	return num;
}

export default class ReconnectionWebSocket extends EventEmitter {

	/** @returns {string} */
	get url() {
		if (this._url === null) throw new Error('not connected');
		return this._url;
	}

	/** @returns {Readonly<{ [chainApi in ChainApi]: EchoApi }>} */
	get echoApis() {
		if (!this.isConnected) throw new Error('not connected');
		return this._echoApis;
	}

	/** @returns {Readonly<Required<Options>>} */
	get options() {
		if (this._options === null) throw new Error('options are not inited');
		return this._options;
	}

	constructor() {
		super();

		/* public readonly */
		/** @type {{ [key: number]: ChainApi }} */
		this.chainApiById = {};
		this.lastUsedId = -1;
		this.isConnected = false;
		/** @type {ChainApi[]} */
		this.apis = [];
		this.connectRetryNumber = 0;
		this.debugger = new ReconnectionWebSocketDebugger(false);

		/* public be getters */
		/** @type {string | null} */
		this._url = null;
		/** @type {{ [apiName in ChainApi]?: EchoApi }} */
		this._echoApis = {};
		/** @type {Required<Options> | null} */
		this._options = null;

		/* private */
		/** @type {WebSocket | null} */
		this._ws = null;
		/** @type {Map<number, Call>} */
		this._calls = new Map();
		/** @type {null | (() => void)} */
		this._resolveDisconnect = null;
		/** @type {Map<number, Subscriber>} */
		this._subscribers = new Map();
		/** @type {number | null} */
		this._pingDelayId = null;
		/** @type {NodeJS.Timeout | null} */
		this._reconnectionTimeoutId = null;
	}

	/**
	 * @param {Options} options
	 * @returns {Required<Options>}
	 */
	_validatedOptions(options) {
		/** @type {Options} */
		const result = {};
		if (options.apis !== undefined) {
			ok(Array.isArray(options.apis), 'apis option is not an array');
			for (const apiName of options.apis) {
				ok(WS_CONSTANTS.CHAIN_APIS.includes(apiName), `unknown api name "${apiName}"`);
			}
			result.apis = options.apis;
		} else result.apis = WS_CONSTANTS.DEFAULT_CHAIN_APIS;
		if (options.connectionTimeout !== undefined) {
			result.connectionTimeout = safeUnsignedInteger(options.connectionTimeout, 'connection timeout');
		} else result.connectionTimeout = WS_CONSTANTS.CONNECTION_TIMEOUT;
		if (options.debug !== undefined) {
			ok(typeof options.debug === 'boolean', 'debug option is not a boolean');
			result.debug = options.debug;
		} else result.debug = WS_CONSTANTS.DEBUG;
		if (options.maxRetries !== undefined) {
			result.maxRetries = safeUnsignedInteger(options.maxRetries, 'max retries');
		} else result.maxRetries = WS_CONSTANTS.MAX_RETRIES;
		if (options.pingDelay !== undefined) {
			result.pingDelay = safeUnsignedInteger(options.pingDelay, 'ping delay');
		} else result.pingDelay = WS_CONSTANTS.PING_DELAY;
		if (options.pingTimeout !== undefined) {
			result.pingTimeout = safeUnsignedInteger(options.pingTimeout, 'ping timeout');
		} else result.pingTimeout = WS_CONSTANTS.PING_TIMEOUT;
		return result;
	}

	/**
	 * @param {string} url
	 * @param {Options} options
	 * @returns {Promise<void>}
	 */
	async connect(url, options) {
		if (this._ws !== null) throw new Error('already connected');
		this._options = this._validatedOptions(options);
		this._url = url;
		this.apis = this._options.apis;
		this.debugger.options = this._options.debug;
		this.debugger.log('connect...');
		this._ws = new WebSocket(url);
		/** @type {null | () => void} */
		let onConnect = null;
		const onceConnected = new Promise((resolve) => { onConnect = resolve; });
		this._ws.on('open', () => onConnect());
		this._ws.on('message', (data) => this._onMessage(data));
		this._ws.on('close', async (code, reason) => {
			this.debugger.event(WS_CONSTANTS.STATUS.CLOSE);
			this._clearPingDelay();
			this._ws = null;
			this.chainApiById = {};
			this._echoApis = {};
			this.lastUsedId = -1;
			this.isConnected = false;
			const error = new ReconnectionWebSocketError(code, reason);
			if ([1006, 1007].includes(error.code)) {
				const calls = [...this._calls.entries()].map(([, call]) => call);
				this._calls.clear();
				this._emitError(error);
				await this.connect(this.url, { ...options, emitOpen: false });
				const subs = [...this._subscribers.entries()]
					.map(([, subscriber]) => subscriber)
					.filter(({ inited }) => inited);
				this._subscribers.clear();
				for (const subscriber of subs) {
					this.call([this._echoApis[subscriber.api].api_id, subscriber.method, subscriber.params])
						.catch((err) => this._emitError(err));
				}
				for (const call of calls) {
					this.call([this._echoApis[call.api].api_id, call.method, call.params])
						.then((res) => call.resolve(res))
						.catch((err) => call.reject(err));
				}
			} else {
				this._subscribers.clear();
				for (const [, { reject }] of this._calls) reject(error);
				this._calls.clear();
				this.emit(WS_CONSTANTS.STATUS.CLOSE);
				if (this._resolveDisconnect) return this._resolveDisconnect();
				this.connectRetryNumber += 1;
				if (this.connectRetryNumber >= this._options.maxRetries) {
					const errorMessageToEmit = `unable to reconnect after ${this.connectRetryNumber} retry`;
					this.emit(WS_CONSTANTS.STATUS.ERROR, new Error(errorMessageToEmit));
				} else {
					this._reconnectionTimeoutId = setTimeout(() => {
						this.connect(this.url, this._options).catch(() => null);
					}, this._options.connectionTimeout);
				}
			}
			return undefined;
		});
		this._ws.on('error', (error) => this._emitError(error));
		await onceConnected;
		this.connectRetryNumber = 0;
		this._setPingDelay();
		this.debugger.log('register apis...');
		await Promise.all(this.apis.map(async (apiName) => {
			if (apiName === WS_CONSTANTS.CHAIN_API.LOGIN_API) return;
			const apiId = await this.call([1, apiName, []]);
			if (typeof apiId !== 'number') throw new Error('unexpected api id type');
			if (this.chainApiById[apiId] !== undefined) throw new Error('api id duplicate');
			this.chainApiById[apiId] = apiName;
			this._echoApis[apiName] = new EchoApi(this, apiName, apiId);
		})).catch(async (error) => {
			if (error instanceof ReconnectionWebSocketError && error.code === ErrorCode.INVALID_API_NAME) {
				await this.close();
			}
			throw error;
		});
		for (const apiName of WS_CONSTANTS.CHAIN_APIS) {
			if (this._echoApis[apiName] === undefined) this._echoApis[apiName] = new EchoApi(this, apiName);
		}
		this.isConnected = true;
		this.debugger.event(WS_CONSTANTS.STATUS.OPEN);
		if (options.emitOpen !== false) this.emit(WS_CONSTANTS.STATUS.OPEN);
	}

	async close() {
		if (!this._ws) throw new ReconnectionWebSocketError(ErrorCode.NOT_CONNECTED, 'not connected');
		if ([WebSocket.CLOSING, WebSocket.CLOSED].includes(this._ws.readyState)) {
			throw new ReconnectionWebSocketError(ErrorCode.DISCONNECTED);
		}
		const onceDisconnected = new Promise((resolve) => { this._resolveDisconnect = () => resolve(); });
		this._ws.close();
		await onceDisconnected;
		this._ws = null;
		this._resolveDisconnect = null;
	}

	async reconnect() {
		const { apis } = this;
		await this.close();
		await this.connect(this.url, { apis });
	}

	/**
	 * @param {[number, string, ...any]} props
	 * @param {number} [timeout]
	 */
	async call(props, timeout = this._options.connectionTimeout) {
		if (!this._ws) throw new Error('Websocket is closed');
		const [apiId, method, params] = props;
		this.lastUsedId += 1;
		const callId = this.lastUsedId;
		if (WS_CONSTANTS.SUBSCRIBERS.includes(method)) {
			ok(typeof params[0] === 'function', 'callback is not a function');
			this._subscribers.set(callId, {
				api: this.chainApiById[apiId],
				inited: false,
				method,
				params: [...params],
				resolver: params[0],
			});
			params[0] = callId;
		}
		const data = { method: 'call', id: callId, params: [apiId, method, params] };
		this.debugger.call(data);
		this._ws.send(JSON.stringify(data));
		if (this._calls.has(callId)) throw new Error('call id duplicate');
		return new Promise((resolve, reject) => {
			/** @type {Call} */
			const call = {
				resolve,
				reject,
				api: this.chainApiById[apiId],
				method,
				params,
				callTimeout: null,
				rejectTimeout: null,
			};
			call.callTimeout = setTimeout(() => {
				call.callTimeout = null;
				call.rejectTimeout = setTimeout(() => {
					call.rejectTimeout = null;
					reject(new Error(`RPC call time is over Id: ${callId}`));
				}, 100);
			}, timeout);
			this._calls.set(callId, call);
		}).then((res) => {
			const subscriber = this._subscribers.get(callId);
			if (subscriber) subscriber.inited = true;
			return res;
		});
	}

	/**
	 * get access to chain
	 * @param {String} user
	 * @param {String} password
	 * @param {Number} timeout - timeout before reject
	 * @returns {Promise}
	 */
	login(user, password, timeout = this._pingTimeout) {
		return this.call([1, 'login', [user, password]], timeout);
	}

	async ping() {
		await this.login('', '');
	}

	_clearPingDelay() {
		if (this._pingDelayId !== null) {
			clearTimeout(this._pingDelayId);
			this._pingDelayId = null;
		}
	}

	_setPingDelay() {
		this._clearPingDelay();
		this._pingDelayId = setTimeout(() => (
			this.ping().catch((error) => this._emitError(error))
		), this._options.pingDelay);
	}

	/**
	 * @private
	 * @param {WebSocket.Data} data
	 * @returns {ReconnectionWebSocketError | undefined}
	 */
	_onMessage(data) {
		this._setPingDelay();
		if (typeof data !== 'string') {
			const code = ErrorCode.UNEXPECTED_RESPONSE_TYPE;
			return this._emitInternalError(code, `unexpected response type ${typeof data}`, data);
		}
		const response = JSON.parse(data);
		this.debugger.reply(response);
		if (!response) {
			return this._emitInternalError(ErrorCode.UNEXPECTED_RESPONSE_TYPE, 'response is empty', response);
		}
		const { method, params } = response;
		if (method === 'notice') {
			if (!Array.isArray(params)) {
				const code = ErrorCode.NOTICE_PARAMS_IS_NOT_AN_ARRAY;
				return this._emitInternalError(code, 'notice params is not an array', params);
			}
			if (params.length !== 2) {
				const code = ErrorCode.UNEXPECTED_NOTICE_PARAMS_LENGTH;
				return this._emitInternalError(code, `unexpected notice params length ${params.length}`, params);
			}
			const [subscriberId, notice] = params;
			if (!this._subscribers.has(subscriberId)) {
				const code = ErrorCode.UNEXPECTED_NOTICE_CALLBACK_ID;
				return this._emitInternalError(code, `unexpected notice callback id ${subscriberId}`, params);
			}
			this._subscribers.get(subscriberId).resolver(notice);
			return undefined;
		}
		const { id, error, result } = response;
		if (typeof id !== 'number') {
			const code = ErrorCode.UNEXPECTED_RESPONSE_ID_TYPE;
			return this._emitInternalError(code, `unexpected response id type ${typeof id}`, id);
		}
		const call = this._calls.get(id);
		if (!call) {
			return this._emitInternalError(ErrorCode.UNEXPECTED_RESPONSE_ID, `unexpected response id ${id}`, id);
		}
		this._calls.delete(id);
		if (call.callTimeout !== undefined) clearTimeout(call.callTimeout);
		else if (call.rejectTimeout !== undefined) clearTimeout(call.rejectTimeout);
		else return undefined;
		if (error !== undefined) call.reject(error);
		else call.resolve(result);
		return undefined;
	}

	/**
	 * @private
	 * @param {any} error
	 */
	_emitError(error) {
		if (this.errorHandlers.length === 0) {
			console.error('[ReconnectionWebsocket] Unhandled response parser error');
			const inspectedError = typeof error !== 'object' || error instanceof Error ? error :
				inspect(error, false, null, true);
			console.error(inspectedError);
		} else for (const handler of this.errorHandlers) handler(error);
		this.emit(WS_CONSTANTS.STATUS.ERROR, error);
	}

	/**
	 * @param {number} code
	 * @param {string} reason
	 * @param {any} [data]
	 * @returns {ReconnectionWebSocketError}
	 */
	_emitInternalError(code, reason, data) {
		const error = new ReconnectionWebSocketError(code, reason, data);
		this._emitError(error);
		return error;
	}

}
