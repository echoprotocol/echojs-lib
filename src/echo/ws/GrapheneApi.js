class GrapheneApi {

	constructor(wsRpc, apiName) {
		this.ws_rpc = wsRpc;
		this.api_name = apiName;
	}

	init() {
		const self = this;
		return this.ws_rpc.call([1, this.api_name, []]).then((response) => {
			self.api_id = response;
			return self;
		});
	}

	exec(method, params) {
		return this.ws_rpc.call([this.api_id, method, params]).catch((error) => {
			throw error;
		});
	}

}

export default GrapheneApi;
