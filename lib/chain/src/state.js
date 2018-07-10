function get(state) {
	return function getter(key) {
		return state[key] || '';
	};
}

function set(state) {
	return function setter(key, value) {
		state[key] = value;
		return this;
	};
}

export { get, set };
