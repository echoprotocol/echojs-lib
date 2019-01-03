import { isFunction } from '../utils/validator';

class Subscriber {

	/**
	 *  @constructor
	 *
	 *  @param {Cache} cache
	 *  @param {WSAPI} wsApi
	 */
	constructor(cache, wsApi) {
		this.cache = cache;
		this._wsApi = wsApi;

		this.subscriptions = {
			all: false,
			account: false,
			echorand: false,
			block: false,
			connect: false,
			disconnect: false,
		};

		this.subscribers = {
			all: [], // "all" means all updates from setSubscribeCallback
			account: [],
			echorand: [],
			block: [],
			connect: [],
			disconnect: [],
		};

	}

	/**
	 *  @method init
	 *
	 *  @return {undefined}
	 */
	init() {
		this._wsApi.database.setSubscribeCallback(this._onUpdate, true);

		if (this.subscriptions.echorand) {
			this._setConsensusMessageCallback();
		}
	}

	_onUpdate() {}

	/**
	 *  @method setOptions
	 *
	 *  @param {Object} options
	 *
	 *  @return {undefined}
	 */
	setOptions(options) {
		this.options = options;
	}

	/**
	 *  @method reset
	 *
	 *  @return {undefined}
	 */
	reset() {
		this.subscriptions = {
			all: false,
			account: false,
			echorand: false,
			block: false,
			connect: false,
			disconnect: false,
		};

		this.subscribers = {
			all: [],
			account: [],
			echorand: [],
			block: [],
			connect: [],
			disconnect: [],
		};
	}

	onAllUpdates() {}

	onAccountUpdate() {}

	/**
	 *  @method _echorandUpdate
	 *
	 *  @param  {Array} result
	 *
	 *  @return {undefined}
	 */
	_echorandUpdate(result) {
		this.subscribers.echorand.forEach((callback) => {
			callback(result);
		});
	}

	/**
	*  @method _setConsensusMessageCallback
	*
	*  @return {Promise.<undefined>}
	*/
	async _setConsensusMessageCallback() {
		if (!this.subscriptions.echorand) {
			await this._wsApi.networkNode.setConsensusMessageCallback(this._echorandUpdate.bind(this));
			this.subscriptions.echorand = true;
		}
	}

	/**
	 *  @method setEchorandSubscribe
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {Promise.<undefined>}
	 */
	async setEchorandSubscribe(callback) {
		if (!isFunction(callback)) {
			throw new Error('Callback is not a function');
		}

		this.subscribers.echorand.push(callback);

		await this._setConsensusMessageCallback();
	}

	/**
	 *  @method removeEchorandSubscribe
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {undefined}
	 */
	removeEchorandSubscribe(callback) {
		this.subscribers.echorand = this.subscribers.echorand.filter((c) => c !== callback);
	}

	onBlockApply() {}

	onConnect() {}

	onDisconnect() {}

}

export default Subscriber;
