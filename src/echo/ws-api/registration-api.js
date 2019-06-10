/* eslint-disable max-len */
class RegistrationAPI {

	/**
	 *  @constructor
	 *
	 *  @param {EchoApi} db [register api]
	 */
	constructor(db) {
		this.db = db;
	}

	/**
     *  @method registerAccount
     *
	 *  @param  {Function} callback
     *  @param  {String} name
     * 	@param  {String} activeKey
     * 	@param  {String} echoRandKey
     *
     *  @return {Promise}
     */
	registerAccount(callback, name, activeKey, echoRandKey) {
		return this.db.exec('register_account', [callback, name, activeKey, echoRandKey]);
	}

}

export default RegistrationAPI;
