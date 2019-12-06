/** @typedef {import("../../constants/ws-constants").ChainApi} ChainApi */
/** @typedef {import(".").EchoWS} EchoWS */

class EchoApi {

	/**
	 *
	 * @param {EchoWS} wsRpc
	 * @param {ChainApi} apiName
	 * @param {number} [apiId]
	 */
	constructor(wsRpc, apiName, apiId) {
		this.ws_rpc = wsRpc;
		this.api_id = apiId;
		this.api_name = apiName;
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
