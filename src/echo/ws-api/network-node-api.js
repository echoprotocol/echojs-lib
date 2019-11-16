class NetworkNodeAPI {

	/**
	 *  @constructor
	 *
	 *  @param {EchoApi} db [network node api]
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 *  @method setConsensusMessageCallback
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {Promise.<null>}
	 */
	setConsensusMessageCallback(callback) {
		return this.db.exec('set_consensus_message_callback', [callback]);
	}

	/**
	 *  @method getConnectedPeers
	 *
	 *  @return {Promise}
	 */
	getConnectedPeers() {
		return this.db.exec('get_connected_peers', []);
	}

	/**
	 *  @method getPotentialPeers
	 *
	 *  @return {Promise}
	 */
	getPotentialPeers() {
		return this.db.exec('get_potential_peers', []);
	}

}

export default NetworkNodeAPI;
