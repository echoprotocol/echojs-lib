export const CONNECTION_TIMEOUT = 5 * 1000;
export const MAX_RETRIES = 0;
export const PING_TIMEOUT = 13 * 1000;
export const PING_INTERVAL = 20 * 1000;
export const DEBUG = false;
export const CHAIN_APIS = ['database', 'network_broadcast', 'history', 'registration', 'asset', 'login', 'network_node'];
export const DEFAULT_CHAIN_APIS = ['database', 'network_broadcast', 'history', 'login'];

export default {
	CONNECTION_TIMEOUT,
	MAX_RETRIES,
	PING_TIMEOUT,
	PING_INTERVAL,
	DEBUG,
	CHAIN_APIS,
	DEFAULT_CHAIN_APIS,
};

export const STATUS = {
	OPEN: 'open',
	ERROR: 'error',
	CLOSE: 'close',
};
