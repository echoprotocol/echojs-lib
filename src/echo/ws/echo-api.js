import { ConnectionType } from '../providers';

/** @typedef {import("../providers").WSProvider} WSProvider */
/** @typedef {import("../providers").HttpProvider} HttpProvider */

class EchoApi {

	/**
	 *
	 * @param {HttpProvider | WSProvider} provider
	 * @param {String} apiName
	 */
	constructor(provider, apiName) {
		this.provider = provider;
		this.apiName = apiName;
		/** @type {number | undefined} */
		this.apiId = undefined;
	}

	/**
	 *
	 * @returns {Promise}
	 */
	async init() {
		if (this.provider.connectionType === ConnectionType.WS) {
			this.apiId = await this.provider.call(1, this.apiName, []);
		} else this.apiId = 0;
		return this;
	}

	/**
	 * execute API method with params
	 * @param {String} method name
	 * @param {Array<any>} params
	 * @returns {Promise}
	 */
	exec(method, params) {
		if (this.provider.connectionType === ConnectionType.HTTP) return this.provider.call(method, params);
		if (this.apiId !== undefined) return this.provider.call(this.apiId, method, params);
		const errMessage = [
			`${this.apiName} API is not available`,
			'try to specify this in connection option called "apis"',
		].join(', ');
		return Promise.reject(new Error(errMessage));
	}

}

export default EchoApi;
