import { ConnectionType } from '../providers';
import { CHAIN_API } from '../../constants/ws-constants';

/** @typedef {import("../providers").WSProvider} WSProvider */
/** @typedef {import("../providers").HttpProvider} HttpProvider */

export default class BaseEchoApi {

	/**
	 *
	 * @param {HttpProvider | WSProvider} provider
	 * @param {string} apiName
	 */
	constructor(provider, apiName) {
		this.provider = provider;
		this.apiName = apiName;
		/** @type {number | null} */
		this.apiId = null;
	}

	/**
	 * @returns {Promise}
	 */
	async init() {
		if (this.provider.connectionType === ConnectionType.WS) {
			if (this.apiName === CHAIN_API.LOGIN_API) this.apiId = 1;
			else this.apiId = await this.provider.call([1, this.apiName, []]);
		} else this.apiId = 0;
		return this;
	}

	/**
	 * execute API method with params
	 * @param {string} method name
	 * @param {any[]} params
	 * @returns {Promise}
	 */
	exec(method, params) {
		if (this.apiId === null) {
			const errMessage = [
				`${this.apiName} API is not available`,
				'try to specify this in connection option called "apis"',
			].join(', ');
			return Promise.reject(new Error(errMessage));
		}
		if (this.provider.connectionType === ConnectionType.HTTP) return this.provider.call(method, params);
		return this.provider.call([this.apiId, method, params]);
	}

}
