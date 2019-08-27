class WalletAPI {

	/**
	 *  @constructor
	 *
	 *  @param {ReconnectionWebSocket} wsRpc
	 */
	constructor(wsRpc) {
		this.wsRpc = wsRpc;
	}

	/**
	 *  @method connect
	 *	@param {String} url - remote node address
	 *	@param {Object} options - connection params.
	 *  @return {Promise}
	 */
	async connect(url, options) {
		await this.wsRpc.connect(url, options);
	}

	/**
	 *  @method info
	 *
	 *  @return {Promise}
	 */
	info() {
		console.log('----------HERE!!!---------');
		return this.wsRpc.call(['info', []]);
	}

	/**
	 *  @method about
	 *
	 *  @return {Promise}
	 */
	about() {
		return this.wsRpc.call([this.api_id, 'about', []]);
	}

}

export default WalletAPI;
