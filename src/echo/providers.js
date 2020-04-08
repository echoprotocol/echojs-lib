import axios from 'axios';
import ReconnectionWebSocket from './ws/reconnection-websocket';

export const ConnectionType = {
	WS: 'ws',
	HTTP: 'http',
};

export class WSProvider {

	get connectionType() { return ConnectionType.WS; }

	constructor() {
		this._ws = new ReconnectionWebSocket();
	}

	async connect(url, options) {
		this.url = url;
		await this._ws.connect(url, options);
	}

	call(apiId, method, params) {
		return this._ws.call([apiId, method, params]);
	}

}

export class HttpProvider {

	get connectionType() { return ConnectionType.HTTP; }

	constructor(url) {
		this.url = url;
	}

	call(method, params) {
		return axios.post(this.url, {
			jsonrpc: '2.0', id: 0, method, params,
		});
	}

}
