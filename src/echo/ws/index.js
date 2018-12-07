class WS {

	constructor() {
		this.ws = null;
	}

	connect(address, options) {
		console.log('WS connect', address, options);
		// TODO create websocket connection
		// this.ws = new WebSocket(address, wsOptions);
	}

	reconnect(address, options) {
		console.log('WS reconnect', address, options);
		// TODO reconnect websocket
	}

	close() {
		// TODO close websocket
	}

}

export default WS;
