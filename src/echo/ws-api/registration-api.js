class RegistrationAPI {

	/**
	 *  @constructor
	 *
	 *  @param {GrapheneAPI} db [register api]
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 *  @method registerAccount
	 *
	 *  @param  {String} accountName
	 * 	@param  {String} ownerKey
	 * 	@param  {String} activeKey
	 * 	@param  {String} memoKey
	 * 	@param  {String} echoRandKey
	 *
	 *  @return {Promise}
	 */
	registerAccount(accountName, ownerKey, activeKey, memoKey, echoRandKey) {
		return this.db.exec('register_account', [accountName, ownerKey, activeKey, memoKey, echoRandKey]);
	}

}

export default RegistrationAPI;
