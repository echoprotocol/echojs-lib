class EchorandAPI {

	/**
     *  @constructor
     *  @param {EchoApi} db [history api]
     */
	constructor(db) {
		this.db = db;
	}

	/**
     *  @method setEchorandMessageCallback
     *
     *  @param  {Function} callback
     *
     *  @return {Promise.<null>}
     */
	setEchorandMessageCallback(callback) {
		return this.db.exec('set_echorand_message_callback', [callback]);
	}

}

export default EchorandAPI;
