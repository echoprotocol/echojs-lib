import { CHAIN_API } from '../../constants/ws-constants';
import BaseEchoApi from './base-api';

/** @typedef {import("../providers").WsProvider} WsProvider */
/** @typedef {import("../providers").HttpProvider} HttpProvider */
/** @typedef {"" | "eth" | "btc"} SidechainType */

class RegistrationAPI extends BaseEchoApi {

	/**
	 * @constructor
	 * @param {WsProvider | HttpProvider} provider
	 */
	constructor(provider) {
		super(provider, CHAIN_API.REGISTRATION_API);
	}

	/**
	 *  @method requestRegistrationTask
	 *
	 *  @return {Promise.<{block_id: String, rand_num: string, difficulty: number}>}
	 */
	requestRegistrationTask() {
		return this.exec('request_registration_task', []);
	}

	/**
	 *  @method submitRegistrationSolution
	 *
	 * 	@param {Function} callback
	 * 	@param {String} name
	 * 	@param {String} activeKey
	 * 	@param {String} echorandKey
	 * 	@param {String} evmAddress
	 * 	@param {Number} nonce
	 * 	@param {Number} randNum
	 *
 	 *  @return {Promise}
	 */
	submitRegistrationSolution(callback, name, activeKey, echorandKey, evmAddress, nonce, randNum) {
		return this.exec('submit_registration_solution', [
			callback,
			name,
			activeKey,
			echorandKey,
			evmAddress,
			nonce,
			randNum,
		]);
	}

	/**
	 *  @method getRegistrar
	 *
 	 *  @return {Promise}
	 */
	getRegistrar() {
		return this.exec('get_registrar', []);
	}

}

export default RegistrationAPI;
