import { CHAIN_API } from '../../constants/ws-constants';
import BaseEchoApi from './base-api';

/** @typedef {import("../providers").WsProvider} WsProvider */
/** @typedef {import("../providers").HttpProvider} HttpProvider */
/** @typedef {"" | "eth" | "btc"} SidechainType */

class AssetAPI extends BaseEchoApi {

	/**
	 * @constructor
	 * @param {WsProvider | HttpProvider} provider
	 */
	constructor(provider) {
		super(provider, CHAIN_API.ASSET_API);
	}

	/**
	 *  @method getAssetHolders
	 *  Retrieve the information about the holders of the specified asset.
	 *
	 *  @param {String} assetId   [asset id to retrieve]
	 *  @param {Number} start [account id to start retrieving from]
	 *  @param {Number} limit     [count accounts (max 100)]
	 *
	 *  @return {Promise.<Array.<{name: String, account_id:String, amount: String}>>}
	 *  [ { name: 'init0', account_id: '1.2.6', amount: '100000039900000' } ]
	 */
	getAssetHolders(assetId, start, limit) {
		return this.exec('get_asset_holders', [assetId, start, limit]);
	}

	/**
	 *  @method getAssetHoldersCount
	 *  Retrieve the number of holders of the provided asset.
	 *
	 *  @param {String} assetId   [asset id to retrieve]
	 *
	 *  @return {Promise.<Number>} result - 8
	 */
	getAssetHoldersCount(assetId) {
		return this.exec('get_asset_holders_count', [assetId]);
	}

	/**
	 *  @method getAllAssetHolders
	 *  Array of all asset IDs with the number of holders.
	 *
	 * 	@return {Promise.<Array.<{asset_id: String, count: Number}>>}
	 * 	[ { asset_id: '1.3.0', count: 8 } ]
	 */
	getAllAssetHolders() {
		return this.exec('get_all_asset_holders', []);
	}

}

export default AssetAPI;
