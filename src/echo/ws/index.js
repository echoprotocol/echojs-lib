import { EventEmitter } from 'events';
import WebSocket from 'isomorphic-ws';
import { inspect } from 'util';
import { CHAIN_APIS, STATUS, CHAIN_API } from '../../constants/ws-constants';
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

export default class ReconnectionWebSocket extends EventEmitter {

	get url() {
		if (this._url === null) throw new Error('not connected');
		return this._url;
	}

	constructor() {
		super();
		/** @type {WebSocket | null} */
		this._ws = null;
		/** @type {string | null} */
		this._url = null;
		/** @type {{ [key: number]: ChainApi }} */
		this._apiNameMap = {};
		/** @type {Map<number, { resolve: (result: any) => any, reject: (error: any) => any }>} */
		this._calls = new Map();
		this._lastUsedId = -1;
		/** @type {Array<(error: any) => any>} */
		this.errorHandlers = [];
		this.isConnected = false;
		/** @type {{ [apiName in ChainApi]?: EchoApi }} */
		this.echoApis = {};
		/** @type {ChainApi[]} */
		this.apis = [];
		/** @type {null | (() => void)} */
		this._onDisconnect = null;
	}

	/**
	 * @param {string} url
	 * @param {ChainApi[]} apis
	 * @returns {Promise<void>}
	 */
	async connect(url, apis) {
		if (this._ws !== null) throw new Error('already connected');
		this._url = url;
		this.apis = apis;
		this._ws = new WebSocket(url);
		/** @type {null | () => void} */
		let onConnect = null;
		const onceConnected = new Promise((resolve) => { onConnect = resolve; });
		this._ws.on('open', () => onConnect());
		this._ws.on('message', (data) => this._onMessage(data));
		this._ws.on('close', (code, reason) => {
			if (code === ErrorCode.FORCE_DISCONNECT && this._onDisconnect) return this._onDisconnect();
			const error = new ReconnectionWebSocketError(code, reason);
			delete this._ws;
			this._apiNameMap = {};
			this._lastUsedId = -1;
			this.isConnected = false;
			for (const [, { reject }] of this._calls) reject(error);
			this._calls.clear();
			this.emit(STATUS.CLOSE);
			return undefined;
		});
		this._ws.on('error', (error) => this._emitError(error));
		await onceConnected;
		await Promise.all(this.apis.map(async (apiName) => {
			if (!CHAIN_APIS.includes(apiName)) {
				const code = ErrorCode.INVALID_API_NAME;
				throw new ReconnectionWebSocketError(code, `unknown api name ${apiName}`, apiName);
			}
			if (apiName === CHAIN_API.LOGIN_API) return;
			const apiId = await this.call([1, apiName, []]);
			if (typeof apiId !== 'number') throw new Error('unexpected api id type');
			if (this._apiNameMap[apiId] !== undefined) throw new Error('api id duplicate');
			this._apiNameMap[apiId] = apiName;
			this.echoApis[apiName] = new EchoApi(this, apiId);
		})).catch(async (error) => {
			if (error instanceof ReconnectionWebSocketError && error.code === ErrorCode.INVALID_API_NAME) {
				await this.close();
			}
			throw error;
		});
		for (const apiName of CHAIN_APIS) {
			if (this.echoApis[apiName] === undefined) this.echoApis[apiName] = new EchoApi(this);
		}
		this.isConnected = true;
		this.emit(STATUS.OPEN);
	}

	async close() {
		if (!this._ws) throw new ReconnectionWebSocketError(ErrorCode.NOT_CONNECTED);
		if ([WebSocket.CLOSING, WebSocket.CLOSED].includes(this._ws.readyState)) {
			throw new ReconnectionWebSocketError(ErrorCode.DISCONNECTED);
		}
		this._ws.close();
		const onceDisconnected = new Promise((resolve) => { this._onDisconnect = () => resolve(); });
		await onceDisconnected;
		this._onDisconnect = null;
	}

	async reconnect() {
		const { apis } = this;
		await this.close();
		await this.connect(this.url, apis);
	}

	/** @param {[number, string, ...any]} props */
	async call(props) {
		const [apiId, method, params] = props;
		this._lastUsedId += 1;
		const callId = this._lastUsedId;
		const data = { method: 'call', id: callId, params: [apiId, method, params] };
		console.log(' >>', data);
		this._ws.send(JSON.stringify(data));
		if (this._calls.has(callId)) throw new Error('call id duplicate');
		return new Promise((resolve, reject) => this._calls.set(callId, { resolve, reject }));
	}

	/**
	 * @private
	 * @param {WebSocket.Data} data
	 * @returns {ReconnectionWebSocketError | undefined}
	 */
	_onMessage(data) {
		console.log(' <<', data);
		if (typeof data !== 'string') {
			const code = ErrorCode.UNEXPECTED_RESPONSE_TYPE;
			return this._emitInternalError(code, `unexpected response type ${typeof data}`, data);
		}
		const response = JSON.parse(data);
		if (!response) {
			return this._emitInternalError(ErrorCode.UNEXPECTED_RESPONSE_TYPE, 'response is empty', response);
		}
		const { id, result, error } = response;
		if (typeof id !== 'number') {
			const code = ErrorCode.UNEXPECTED_RESPONSE_ID_TYPE;
			return this._emitInternalError(code, `unexpected response id type ${typeof id}`, id);
		}
		const call = this._calls.get(id);
		if (!call) {
			return this._emitInternalError(ErrorCode.UNEXPECTED_RESPONSE_ID, `unexpected response id ${id}`, id);
		}
		this._calls.delete(id);
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
		this.emit(STATUS.ERROR, error);
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
