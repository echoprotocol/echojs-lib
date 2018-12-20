class GrapheneApi {

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
		if (!this.api_id) return Promise.reject(new Error(`Access to ${this.api_name} API does't exist`));
		return this.ws_rpc.call([this.api_id, method, params]);
	}

}

export default GrapheneApi;
