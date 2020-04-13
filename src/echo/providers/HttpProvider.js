import Axios from 'axios';

import * as ConnectionType from './connection-types';

export default class HttpProvider {

	get connectionType() { return ConnectionType.HTTP; }

	constructor(url) {
		this.url = url;
	}

	async call(method, params) {
		return Axios.post(this.url, {
			jsonrpc: '2.0', id: 0, method, params,
		}).then((res) => res.data.result);
	}

}
