
let wsApi = null;

class Subscriber {

	constructor(cache, api) {
		this.cache = cache;
		wsApi = api;

		console.log('Subscriber constructor', wsApi);
	}

	reset() {
		// TODO reset subscribers
		wsApi = null;
	}

}

export default Subscriber;
