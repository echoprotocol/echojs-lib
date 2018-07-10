import ee from 'event-emitter';

let _emitter;

export default function emitter() {
	if (!_emitter) {
		_emitter = ee({});
	}
	return _emitter;
}
