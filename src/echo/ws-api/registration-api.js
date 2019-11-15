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
	 *  @method requestRegistrationTask
	 *
	 *  @return {Promise.<{block_id: String, rand_num: string, difficulty: number}>}
	 */
	requestRegistrationTask() {
		return this.db.exec('request_registration_task', []);
	}

	/**
	 *  @method submitRegistrationSolution
	 *
	 * 	@param {Function} callback
	 * 	@param {String} name
	 * 	@param {String} activeKey
	 * 	@param {String} echorandKey
	 * 	@param {Number} nounce
	 * 	@param {Number} randNum
	 *
 	 *  @return {Promise}
	 */
	submitRegistrationSolution(callback, name, activeKey, echorandKey, nonce, randNum) {
		return this.db.exec('submit_registration_solution', [callback, name, activeKey, echorandKey, nonce, randNum]);
	}

	/**
	 *  @method getRegistrar
	 *
 	 *  @return {Promise}
	 */
	getRegistrar() {
		return this.db.exec('get_registrar', []);
	}

}

export default RegistrationAPI;
