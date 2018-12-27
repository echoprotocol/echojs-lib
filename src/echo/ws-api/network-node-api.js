class NetworkNodeAPI {

	/**
	 *  @constructor
	 *
	 *  @param {GrapheneApi} db [network node api]
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 *  @method setСonsensusMessageCallback
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {Promise.<null>}
	 */
	setСonsensusMessageCallback(callback) {
		return this.db.exec('set_consensus_message_callback', [callback]);
	}


}

export default NetworkNodeAPI;
