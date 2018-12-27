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

		this._init();
	}

	_init() {
		this._wsApi.database.setSubscribeCallback(this._onUpdate, true);
	}

	_onUpdate() {}

	/**
	 *  @method setOptions
	 *
	 *  @param {Object} options
	 *
	 *  @return {Void}
	 */
	setOptions(options) {
		this.options = options;
	}

	/**
	 *  @method reset
	 *
	 *  @return {Void}
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
	 *  @return {Void}
	 */
	_echorandUpdate(result) {
		this.subscribers.echorand.forEach((callback) => {
			callback(result);
		});
	}

	/**
	 *  @method setEchorandSubscribe
	 *
	 *  @param  {Function} callback
	 *
	 *  @return {Promise.<Number>}
	 */
	async setEchorandSubscribe(callback) {
		const index = this.subscribers.echorand.push(callback) - 1;

		if (!this.subscriptions.echorand) {
			await this._wsApi.networkNode.setConsensusMessageCallback(this._echorandUpdate.bind(this));
			this.subscriptions.echorand = true;
		}

		return index;
	}

	/**
	 *  @method removeEchorandSubscribe
	 *
	 *  @param  {Number} index
	 *
	 *  @return {Void}
	 */
	removeEchorandSubscribe(index) {
		this.subscribers.echorand = this.subscribers.echorand.filter((c, i) => i !== index);
	}

	onBlockApply() {}

	onConnect() {}

	onDisconnect() {}

}

export default Subscriber;
