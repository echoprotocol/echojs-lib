import ChainWebSocket from './ChainWebSocket';
import GrapheneApi from './GrapheneApi';
import ChainConfig from './ChainConfig';


class ApisInstance {

	constructor() {
		this.ws_rpc = new ChainWebSocket();
	}

	/** @arg {string} connection .. */
	connect(url, options) {
		this.url = url;
		const rpcUser = '';
		const rpcPassword = '';
		if (typeof window !== 'undefined' && window.location && window.location.protocol === 'https:' && url.indexOf('wss://') < 0) {
			throw new Error('Secure domains require wss connection');
		}

		if (this.ws_rpc) {
			this.ws_rpc.statusCb = null;
			this.ws_rpc.keepAliveCb = null;
			this.ws_rpc.on_close = null;
			this.ws_rpc.on_reconnect = null;
		}

		this.ws_rpc.connect(url, options);
		this.init_promise = this.ws_rpc.login(rpcUser, rpcPassword).then(() => {
			// console.log("Connected to API node:", cs);
			this._db = new GrapheneApi(this.ws_rpc, 'database');
			this._net = new GrapheneApi(this.ws_rpc, 'network_broadcast');
			this._hist = new GrapheneApi(this.ws_rpc, 'history');

			const dbPromise = this._db.init().then(() =>
			// https://github.com/cryptonomex/graphene/wiki/chain-locked-tx
				this._db.exec('get_chain_id', []).then((_chainId) => {
					this.chain_id = _chainId;
					return ChainConfig.setChainId(_chainId);
					// DEBUG console.log("chain_id1",this.chain_id)
				}));
			this.ws_rpc.on_reconnect = () => {
				if (!this.ws_rpc) return;
				this.ws_rpc.login('', '').then(() => {
					this._db.init().then(() => {
						if (this.statusCb) { this.statusCb('reconnect'); }
					});
					this._net.init();
					this._hist.init();
					if (optionalApis.enableCrypto) this._crypt.init();
				});
			};
			this.ws_rpc.on_close = () => {
				this.close().then(() => {
					if (this.closeCb) this.closeCb();
				});
			};
			const initPromises = [
				dbPromise,
				this._net.init(),
				this._hist.init(),
			];


			return Promise.all(initPromises);
		}).catch((err) => {
			console.error(url, 'Failed to initialize with error', err && err.message);
			return this.close().then(() => {
				throw err;
			});
		});
	}

	reconnect() {

    }

	close() {
		if (this.ws_rpc && this.ws_rpc.ws.readyState === 1) {
			return this.ws_rpc.close()
				.then(() => {
					this.ws_rpc = null;
				});
		}
		this.ws_rpc = null;
		return Promise.resolve();
	}

	dbApi() {
		return this._db;
	}

	networkApi() {
		return this._net;
	}

	historyApi() {
		return this._hist;
	}

}

export default ApisInstance;
