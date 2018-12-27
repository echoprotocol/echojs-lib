class AssetAPI {

	/**
	 *  @constructor
	 *
	 *  @param {GrapheneAPI} db [asset api]
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 *  @method getAssetHolders
	 *  Retrieve the information about the holders of the specified asset.
	 *
	 *  @param {String} assetId   [asset id to retrieve]
	 *  @param {Number} start [account id to start retreiving from]
	 *  @param {Number} limit     [count accounts (max 100)]
	 *
	 *  @return {Promise} result - [ { name: 'init0', account_id: '1.2.6', amount: '100000039900000' } ]
	 */
	getAssetHolders(assetId, start, limit) {
		return this.db.exec('get_asset_holders', [assetId, start, limit]);
	}

	/**
	 *  @method getAssetHoldersCount
	 *  Retrieve the number of holders of the provided asset.
	 *
	 *  @param {String} assetId   [asset id to retrieve]
	 *
	 *  @return {Promise} result - 8
	 */
	getAssetHoldersCount(assetId) {
		return this.db.exec('get_asset_holders_count', [assetId]);
	}

	/**
	 *  @method getAllAssetHolders
	 *  Array of all asset IDs with the number of holders.
	 *
	 * 	@return {Promise} result - [ { asset_id: '1.3.0', count: 8 } ]
	 */
	getAllAssetHolders() {
		return this.db.exec('get_all_asset_holders', []);
	}

}

export default AssetAPI;
