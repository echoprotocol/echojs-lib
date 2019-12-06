export default class EchoWSDebugger {

	/** @param {boolean} options */
	constructor(options) {
		this.options = options;
	}

	call(data) {
		if (this.options) console.log(`[EchoWebSocket] >--- call ----> ${JSON.stringify(data)}`);
	}

	reply(data) {
		if (this.options) console.log(`[EchoWebSocket] <--- reply ---< ${JSON.stringify(data)}`);
	}

	log(data) {
		if (this.options) {
			const message = typeof data === 'string' ? data : JSON.stringify(data);
			console.log(`[EchoWebSocket] --------------- ${message}`);
		}
	}

	error(err) {
		const message = typeof data === 'string' ? err : JSON.stringify(err);
		console.error(`[EchoWebSocket] ==== ERROR ==== ${message}`);
	}

	event(data) {
		if (this.options) {
			const event = typeof data === 'string' ? data : JSON.stringify(data);
			console.log(`[EchoWebSocket] >--- event ---> ${event}`);
		}
	}

}
