class WalletAPI {

	/**
	 *  @constructor
	 *
	 *  @param {EchoApi} wallet [wallet api]
	 */
	constructor(wallet) {
		this.wallet = wallet;
	}

	/**
	 *  @method info
	 *
	 *  @return {Promise}
	 */
	info() {
		return this.wallet.exec('info', []);
	}

	/**
	 *  @method about
	 *
	 *  @return {Promise}
	 */
	about() {
		return this.wallet.exec('about', []);
	}

}

export default WalletAPI;
