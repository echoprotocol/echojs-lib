export const CONNECTION_TIMEOUT = 5 * 1000;
export const MAX_RETRIES = 1000;
export const PING_TIMEOUT = 10 * 1000;
export const PING_DELAY = 10 * 1000;
export const DEBUG = false;
export const CHAIN_APIS = [
	'database',
	'network_broadcast',
	'history',
	'registration',
	'asset',
	'login',
	'network_node',
];
export const DEFAULT_CHAIN_APIS = [
	'database',
	'network_broadcast',
	'history',
	'login',
];

export const STATUS = {
	OPEN: 'OPEN',
	ERROR: 'ERROR',
	CLOSE: 'CLOSE',
};

export default {
	CONNECTION_TIMEOUT,
	MAX_RETRIES,
	PING_TIMEOUT,
	PING_DELAY,
	DEBUG,
	CHAIN_APIS,
	DEFAULT_CHAIN_APIS,
	STATUS,
};
