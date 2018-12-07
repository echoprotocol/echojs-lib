let ws = null;
let wsApi = null;

class API {

	constructor(cache, api, options) {
		wsApi = api;
		({ ws }) = wsApi;
		this.options = options;

		console.log('API constructor', ws);
	}

	reset() {
		// TODO reset
	}

}

export default API;
