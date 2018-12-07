import WS from '../ws';
import WSAPI from '../ws/api';

import Cache from './cache';
import API from './api';
import Subscriber from './subscriber';

const ws = new WS();
const wsApi = new WSAPI(ws);

class EchoStore {

	connect({
		address, wsOptions, cbOptions, cacheOptions,
	}) {
		ws.connect(address, wsOptions);

		this.cache = new Cache(cacheOptions);
		this.api = new API(this.cache, wsApi, cbOptions);
		this.subscriber = new Subscriber(this.cache, wsApi);
	}

	reconnect(address, options) {
		ws.reconnect(address, options);
	}

	disconnect() {
		this.api.reset();
		this.subscriber.reset();
		ws.close();
	}

}

export default EchoStore;
