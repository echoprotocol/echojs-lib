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
	 * 	@param  {String} echoRandKey
	 * 	@param  {String} registrarAccount
	 * 	@param  {String} referrerAccount
	 * 	@param  {String} referrerPercent
	 *
	 *  @return {Promise}
	 */
	registerAccount(
		accountName, ownerKey, activeKey, echoRandKey,
		registrarAccountName, referrerAccountName, referrerPercent,
	) {
		return this.db.exec('register_account', [
			accountName,
			ownerKey,
			activeKey,
			echoRandKey,
			registrarAccountName,
			referrerAccountName,
			referrerPercent,
		]);
	}

}

export default RegistrationAPI;
