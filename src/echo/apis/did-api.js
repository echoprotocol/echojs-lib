import { CHAIN_API } from '../../constants/ws-constants';
import BaseEchoApi from './base-api';

/** @typedef {import("../providers").WsProvider} WsProvider */
/** @typedef {import("../providers").HttpProvider} HttpProvider */
/** @typedef {"" | "eth" | "btc"} SidechainType */

class DidAPI extends BaseEchoApi {

	/**
	 * @constructor
	 * @param {WsProvider | HttpProvider} provider
	 */
	constructor(provider) {
		super(provider, CHAIN_API.ECHORAND_API);
	}

	/**
     *  @method getDidObject
     *
     *  @param  {string} id
     *
     *  @return {Promise.<Object>}
     */
	getDidObject(id) {
		return this.exec('get_did_object', [id]);
	}

	/**
     *  @method getKey
     *
     *  @param  {string} idString
     *
     *  @return {Promise.<Object>}
     */
	getKey(idString) {
		return this.exec('get_key', [idString]);
	}

	/**
     *  @method getKeys
     *
     *  @param  {string} idString
     *
     *  @return {Promise.<Array>}
     */
	getKeys(idString) {
		return this.exec('get_keys', [idString]);
	}

}

export default DidAPI;
