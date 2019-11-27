/** @typedef {import(".").default} ReconnectionWebSocket */

class EchoApi {

	/**
	 *
	 * @param {ReconnectionWebSocket} wsRpc
	 * @param {number} [apiId]
	 */
	constructor(wsRpc, apiId) {
		this.ws_rpc = wsRpc;
		this.api_id = apiId;
	}

	/**
	 * execute API method with params
	 * @param {String} method name
	 * @param {Array<any>} params
	 * @returns {Promise}
	 */
	async exec(method, params) {
		if (this.api_id === undefined) {
			const errMessage = [
				`${this.api_name} API is not available`,
				'try to specify this in connection option called "apis"',
			].join(', ');
			throw new Error(errMessage);
		}
		return this.ws_rpc.call([this.api_id, method, params]);
	}

}

export default EchoApi;
