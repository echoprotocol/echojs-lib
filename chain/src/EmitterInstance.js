const ee = require('event-emitter');

let _emitter;

module.exports = function emitter() {
	if (!_emitter) {
		_emitter = ee({});
	}
	return _emitter;
};
