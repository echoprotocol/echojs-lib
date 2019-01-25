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
     *  @param  {String} name
     * 	@param  {String} ownerKey
     * 	@param  {String} activeKey
     * 	@param  {String} echoRandKey
     * 	@param  {String} memoKey
     *
     *  @return {Promise}
     */
	registerAccount(name, ownerKey, activeKey, memoKey, echoRandKey) {
		return this.db.exec('register_account', [name, ownerKey, activeKey, memoKey, echoRandKey]);
	}

}

export default RegistrationAPI;
