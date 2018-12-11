import ChainWebSocket from './ChainWebSocket';
import GrapheneApi from './GrapheneApi';

class ApisInstance {

	constructor() {
		this._ws_rpc = new ChainWebSocket();

		this.onOpenCb = null;
		this.onCloseCb = null;
		this.onErrorCb = null;
	}

	async onOpen() {
		if (!this._ws_rpc) return;

		await this._ws_rpc.login('', '');

		const initPromises = [
			this._db.init(),
			this._net.init(),
			this._hist.init(),
			// this._reg.init(),
			// this._asset.init(),
		];

		await Promise.all(initPromises);

		if (this.onOpenCb) this.onOpenCb('open');
	}

	async onClose() {
		await this.close();
		if (this.onCloseCb) this.onCloseCb('close');
	}

	onError(error) {
		if (this.onErrorCb) this.onErrorCb('error', error);
	}

	async connect(url, options) {
		if (typeof window !== 'undefined' && window.location && window.location.protocol === 'https:' && url.indexOf('wss://') < 0) {
			throw new Error('Secure domains require wss connection');
		}

		this.url = url;
		this.options = options;

		if (options && typeof options === 'object') {
			if (options.onOpen && typeof options.onOpen === 'function') this.onOpenCb = options.onOpen;
			if (options.onClose && typeof options.onClose === 'function') this.onCloseCb = options.onClose;
			if (options.onError && typeof options.onError === 'function') this.onErrorCb = options.onError;
		}

		this._ws_rpc.onOpen = async () => { await this.onOpen(); };
		this._ws_rpc.onClose = async () => { await this.onClose(); };
		this._ws_rpc.onError = () => { this.onError(); };

		this._db = new GrapheneApi(this._ws_rpc, 'database');
		this._net = new GrapheneApi(this._ws_rpc, 'network_broadcast');
		this._hist = new GrapheneApi(this._ws_rpc, 'history');
		this._reg = new GrapheneApi(this._ws_rpc, 'registration');
		this._asset = new GrapheneApi(this._ws_rpc, 'asset');

		try {
			return await this._ws_rpc.connect(url, options);
		} catch (err) {
			console.error(url, 'Failed to initialize with error', err && err.message);
			await this.close();
			return Promise.reject(err);
		}

	}

	reconnect() {
		if (!this._ws_rpc) return;
		this._ws_rpc.reconnect();
	}

	async close() {
		if (this._ws_rpc && this._ws_rpc.ws && this._ws_rpc.ws.readyState === 1) {
			await this._ws_rpc.close();
		}
		this._ws_rpc = null;
		return Promise.resolve();
	}

	setDebugOption(status) {
		this._ws_rpc.setDebugOption(status);
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
