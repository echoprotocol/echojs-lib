class EchoApi {

	/**
	 *
	 * @param {ReconnectionWebSocket} wsRpc
	 * @param {String} apiName
	 */
	constructor(wsRpc, apiName) {
		this.ws_rpc = wsRpc;
		this.api_name = apiName;
	}

	/**
	 *
	 * @returns {Promise}
	 */
	async init() {
		try {
			this.api_id = await this.ws_rpc.call([1, this.api_name, []]);
			return this;
		} catch (e) {
			throw e;
		}
	}

	/**
	 * execute API method with params
	 * @param {String} method name
	 * @param {Array<any>} params
	 * @returns {Promise}
	 */
	exec(method, params) {
		if (!this.api_id) {
			return Promise.reject(new Error(`${this.api_name} API is not available,
			try to specify this in connection options`));
		}
		return this.ws_rpc.call([this.api_id, method, params]);
	}

}

export default EchoApi;
