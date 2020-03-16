class EchorandAPI {

	/**
     *  @constructor
     *  @param {EchoApi} db [history api]
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
		return this.db.exec('set_echorand_message_callback', [callback]);
	}

}

export default EchorandAPI;
