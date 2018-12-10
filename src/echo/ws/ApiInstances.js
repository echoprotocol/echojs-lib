import ChainWebSocket from './ChainWebSocket';
import GrapheneApi from './GrapheneApi';
import ChainConfig from './ChainConfig';


class ApisInstance {

	constructor() {
		this.ws_rpc = new ChainWebSocket();
	}


	/** @arg {string} connection .. */
	async connect(url, options) {
		this.url = url;
		this.options = options;
		if (typeof window !== 'undefined' && window.location && window.location.protocol === 'https:' && url.indexOf('wss://') < 0) {
			throw new Error('Secure domains require wss connection');
		}

		if (this.ws_rpc) {
			this.ws_rpc.onOpenCb = null;
			this.ws_rpc.onCloseCb = null;
		}

		try {
			this._db = new GrapheneApi(this.ws_rpc, 'database');
			this._net = new GrapheneApi(this.ws_rpc, 'network_broadcast');
			this._hist = new GrapheneApi(this.ws_rpc, 'history');
			this._reg = new GrapheneApi(this.ws_rpc, 'registration');
			this._asset = new GrapheneApi(this.ws_rpc, 'asset');

			// this._db.exec('get_chain_id', []).then((_chainId) => {
			//     this.chain_id = _chainId;
			//     return ChainConfig.setChainId(_chainId);
			// });

			const onSocketOpen = async () => { await this.onOpen(); };
			const onSocketClose = async () => { await this.onClose(); };

			this.ws_rpc.addEventListener('open', onSocketOpen);
			this.ws_rpc.addEventListener('close', onSocketClose);

			await this.ws_rpc.connect(this.url, this.options);
		} catch (err) {
			console.error(url, 'Failed to initialize with error', err && err.message);
			await this.close();
			throw err;
		}

	}

	async onOpen() {
		if (!this.ws_rpc) return;

		await this.ws_rpc.login('', '');

		const initPromises = [
			this._db.init(),
			this._net.init(),
			this._hist.init(),
			this._reg.init(),
			this._asset.init(),
		];

		await Promise.all(initPromises);

		if (this.onOpenCb) this.onOpenCb();
	}

	async onClose() {
		await this.close();
		if (this.onCloseCb) this.onCloseCb();
	}

	reconnect() {
		if (!this.ws_rpc) return;
		this.ws_rpc.reconnect();
	}

	async close() {
		if (this.ws_rpc && this.ws_rpc.ws.readyState === 1) {
			await this.ws_rpc.close();
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

	registrationApi() {
		return this._reg;
	}

	assetApi() {
		return this._asset;
	}

}

export default ApisInstance;
