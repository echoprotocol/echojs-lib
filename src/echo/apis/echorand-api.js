import { CHAIN_API } from '../../constants/ws-constants';
import BaseEchoApi from './base-api';

/** @typedef {import("../providers").WsProvider} WsProvider */
/** @typedef {import("../providers").HttpProvider} HttpProvider */
/** @typedef {"" | "eth" | "btc"} SidechainType */

class EchorandAPI extends BaseEchoApi {

	/**
	 * @constructor
	 * @param {WsProvider | HttpProvider} provider
	 */
	constructor(provider) {
		super(provider, CHAIN_API.ECHORAND_API);
	}

	/**
     *  @method setEchorandMessageCallback
     *
     *  @param  {Function} callback
     *
     *  @return {Promise.<null>}
     */
	setEchorandMessageCallback(callback) {
		return this.exec('set_echorand_message_callback', [callback]);
	}

}

export default EchorandAPI;
