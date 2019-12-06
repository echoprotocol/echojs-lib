/* global window */

import { ok } from 'assert';
import { EventEmitter } from 'events';
import WebSocket from 'isomorphic-ws';

import * as WS_CONSTANTS from '../../constants/ws-constants';
import { validateUrl } from '../../utils/validators';
import EchoApi from './echo-api';
import EchoWSDebugger from './echo-ws-debugger';
import EchoWSError, { EchoWSErrorCode } from './echo-ws-error';

/** @typedef {import('../../constants/ws-constants').ChainApi} ChainApi */

/**
 * @typedef {Object} Options
 * @property {number} connectionTimeout
 * @property {number} maxRetries
 * @property {number} pingTimeout
 * @property {number} pingDelay
 * @property {boolean} debug
 * @property {ChainApi[]} apis
 */

/**
 * @typedef {Object} TempOptions
 * @property {() => any} [onOpen]
 * @property {(code: number, reason: string) => any} [onClose]
 * @property {(error: any) => any} [onError]
 * @property {boolean} [emitOpen]
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

export default class EchoWS extends EventEmitter {

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

	/** @returns {Readonly<Options>} */
	get options() {
		if (this._options === null) throw new Error('options are not inited');
		return this._options;
	}

	dbApi() { return this.echoApis.database; }
	networkApi() { return this.echoApis.network_broadcast; }
	historyApi() { return this.echoApis.history; }
	registrationApi() { return this.echoApis.registration; }
	assetApi() { return this.echoApis.asset; }
	loginApi() { return this.echoApis.login; }
	networkNodeApi() { return this.echoApis.network_node; }

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

		/* public be getters */
		/** @type {string | null} */
		this._url = null;
		/** @type {{ [apiName in ChainApi]?: EchoApi }} */
		this._echoApis = {};
		/** @type {Options | null} */
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
		this.debugger = new EchoWSDebugger(false);
	}

	/**
	 * @param {string} url
	 * @param {Partial<Options> & TempOptions} [options]
	 * @returns {Promise<void>}
	 */
	async connect(url, options = {}) {
		if (!validateUrl(url)) throw new Error(`Invalid address ${url}`);
		if (typeof window !== 'undefined' &&
			window.location &&
			window.location.protocol === 'https:' &&
			url.indexOf('wss://') < 0) {
			throw new Error('Secure domains require wss connection');
		}
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
		this._subscribeFromOptions(options);
		this._ws.onopen = () => onConnect();
		this._ws.onmessage = ({ data }) => this._onMessage(data);
		this._ws.onclose = async ({ code, reason }) => this._onClose(code, reason);
		this._ws.onerror = ({ error }) => this._emitError(error);
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
			if (error instanceof EchoWSError && error.code === EchoWSErrorCode.INVALID_API_NAME) {
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

	/**
	 * @param {[number, string, ...any]} props
	 * @param {number} [timeout]
	 * @returns {Promise<any>}
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

	/** @returns {Promise<void>} */
	async close() {
		if (!this._ws) throw new EchoWSError(EchoWSErrorCode.NOT_CONNECTED, 'not connected');
		if ([WebSocket.CLOSING, WebSocket.CLOSED].includes(this._ws.readyState)) {
			throw new EchoWSError(EchoWSErrorCode.DISCONNECTED);
		}
		const onceDisconnected = new Promise((resolve) => { this._resolveDisconnect = () => resolve(); });
		this._ws.close();
		await onceDisconnected;
		this._ws = null;
		this._resolveDisconnect = null;
	}

	/**
	 * Set debug option
	 * @param {boolean} debug
	 */
	setDebugOption(debug) {
		this._options.debug = debug;
		this.debugger.options = debug;
	}

	/**
	 * get access to chain
	 * @param {String} user
	 * @param {String} password
	 * @param {Number} timeout - timeout before reject
	 * @returns {Promise<unknown>}
	 */
	login(user, password, timeout = this._pingTimeout) {
		return this.call([1, 'login', [user, password]], timeout);
	}

	/** @returns {Promise<void>} */
	async ping() {
		await this.login('', '');
	}

	/** @returns {Promise<void>} */
	async reconnect() {
		const { apis } = this;
		await this.close();
		await this.connect(this.url, { apis });
	}

	/** @private */
	_clearPingDelay() {
		if (this._pingDelayId !== null) {
			clearTimeout(this._pingDelayId);
			this._pingDelayId = null;
		}
	}

	/**
	 * @private
	 * @param {any} error
	 */
	_emitError(error) {
		if (this.listenerCount(WS_CONSTANTS.STATUS.ERROR) === 0) this.debugger.error(error);
		else this.emit(WS_CONSTANTS.STATUS.ERROR, error);
	}

	/**
	 * @private
	 * @param {number} code
	 * @param {string} reason
	 * @param {any} [data]
	 * @returns {EchoWSError}
	 */
	_emitInternalError(code, reason, data) {
		const error = new EchoWSError(code, reason, data);
		this._emitError(error);
		return error;
	}

	/**
	 * @private
	 * @returns {Promise<void>}
	 */
	async _onClose(code, reason) {
		this.debugger.event(WS_CONSTANTS.STATUS.CLOSE);
		this._clearPingDelay();
		this._ws = null;
		this.chainApiById = {};
		this._echoApis = {};
		this.lastUsedId = -1;
		this.isConnected = false;
		const error = new EchoWSError(code, reason);
		if ([1006, 1007].includes(error.code)) {
			const calls = [...this._calls.entries()].map(([, call]) => call);
			this._calls.clear();
			this._emitError(error);
			await this.connect(this.url, { ...this._options, emitOpen: false });
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
			if (this._resolveDisconnect) {
				this._resolveDisconnect();
				return;
			}
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
	}

	/**
	 * @private
	 * @param {WebSocket.Data} data
	 * @returns {EchoWSError | undefined}
	 */
	_onMessage(data) {
		this._setPingDelay();
		if (typeof data !== 'string') {
			const code = EchoWSErrorCode.UNEXPECTED_RESPONSE_TYPE;
			return this._emitInternalError(code, `unexpected response type ${typeof data}`, data);
		}
		const response = JSON.parse(data);
		this.debugger.reply(response);
		if (!response) {
			return this._emitInternalError(EchoWSErrorCode.UNEXPECTED_RESPONSE_TYPE, 'response is empty', response);
		}
		const { method, params } = response;
		if (method === 'notice') {
			if (!Array.isArray(params)) {
				const code = EchoWSErrorCode.NOTICE_PARAMS_IS_NOT_AN_ARRAY;
				return this._emitInternalError(code, 'notice params is not an array', params);
			}
			if (params.length !== 2) {
				const code = EchoWSErrorCode.UNEXPECTED_NOTICE_PARAMS_LENGTH;
				return this._emitInternalError(code, `unexpected notice params length ${params.length}`, params);
			}
			const [subscriberId, notice] = params;
			if (!this._subscribers.has(subscriberId)) {
				const code = EchoWSErrorCode.UNEXPECTED_NOTICE_CALLBACK_ID;
				return this._emitInternalError(code, `unexpected notice callback id ${subscriberId}`, params);
			}
			this._subscribers.get(subscriberId).resolver(notice);
			return undefined;
		}
		const { id, error, result } = response;
		if (typeof id !== 'number') {
			const code = EchoWSErrorCode.UNEXPECTED_RESPONSE_ID_TYPE;
			return this._emitInternalError(code, `unexpected response id type ${typeof id}`, id);
		}
		const call = this._calls.get(id);
		if (!call) {
			return this._emitInternalError(EchoWSErrorCode.UNEXPECTED_RESPONSE_ID, `unexpected response id ${id}`, id);
		}
		this._calls.delete(id);
		if (call.callTimeout !== undefined) clearTimeout(call.callTimeout);
		else if (call.rejectTimeout !== undefined) clearTimeout(call.rejectTimeout);
		else return undefined;
		if (error !== undefined) call.reject(error);
		else call.resolve(result);
		return undefined;
	}

	/** @private */
	_setPingDelay() {
		this._clearPingDelay();
		this._pingDelayId = setTimeout(() => (
			this.ping().catch((error) => this._emitError(error))
		), this._options.pingDelay);
	}

	/** @param {TempOptions} options */
	_subscribeFromOptions(options) {
		if (options.onOpen !== undefined) {
			ok(typeof options.onOpen === 'function', '"onOpen" callback is not a function');
			this.on(WS_CONSTANTS.STATUS.OPEN, this._options.onOpen);
		}
		if (options.onClose !== undefined) {
			ok(typeof options.onClose === 'function', '"onClose" callback is not a function');
			this.on(WS_CONSTANTS.STATUS.ERROR, this._options.onError);
		}
		if (options.onError !== undefined) {
			ok(typeof options.onError === 'function', '"onError" callback is not a function');
			this.on(WS_CONSTANTS.STATUS.CLOSE, this._options.onClose);
		}
	}

	/**
	 * @private
	 * @param {Partial<Options>} options
	 * @returns {Options}
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

}
