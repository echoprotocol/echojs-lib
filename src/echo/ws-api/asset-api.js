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
	 *  Retreive the information about the holders of the specified asset.
	 *
	 *  @param {String} assetId   [asset id to retreive]
	 *  @param {Number} start [account id to start retreiving from]
	 *  @param {Number} limit     [count accounts (max 100)]
	 */
	getAssetHolders(assetId, start, limit) {
		return this.db.exec('get_asset_holders', [assetId, start, limit]);
	}

	/**
	 *  @method getAssetHoldersCount
	 *  Retreive the number of holders of the provided asset.
	 *
	 *  @param {String} assetId   [asset id to retreive]
	 */
	getAssetHoldersCount(assetId) {
		return this.db.exec('get_asset_holders_count', [assetId]);
	}

	/**
	 *  @method getAllAssetHolders
	 *  Array of all asset IDs with the number of holders.
	 *
	 */
	getAllAssetHolders() {
		return this.db.exec('get_all_asset_holders', []);
	}

}

export default AssetAPI;
