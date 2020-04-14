import Axios from 'axios';

import * as ConnectionType from './connection-types';

export const unsupportedMethods = [
	// methods with callbacks
	'set_subscribe_callback',
	'set_pending_transaction_callback',
	'set_block_applied_callback',
	'get_contract_logs',
	'subscribe_contract_logs',
	// useless for http connection methods
	'cancel_all_subscriptions',
	'subscribe_contracts',
	'unsubscribe_contract_logs',
];

export default class HttpProvider {

	get connectionType() { return ConnectionType.HTTP; }
	get unsupportedMethods() { return [...unsupportedMethods]; }
	constructor(url) { this.url = url; }
	async call(method, params) {
		if (this.unsupportedMethods.includes(method)) {
			throw new Error(`method ${method} not supported by http connection`);
		}
		return Axios.post(this.url, {
			jsonrpc: '2.0', id: 0, method, params,
		}).then((res) => res.data.result);
	}

}
