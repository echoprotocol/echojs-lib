class GrapheneApi {

	constructor(wsRpc, apiName) {
		this.ws_rpc = wsRpc;
		this.api_name = apiName;
	}

	/**
	 *
     * @returns {Promise}
     */
	async init() {
		const self = this;
		try {
			self.api_id = await this.ws_rpc.call([1, this.api_name, []]);
			return self;
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
