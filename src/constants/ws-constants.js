export const CONNECTION_TIMEOUT = 5 * 1000;
export const MAX_RETRIES = 1000;
export const PING_TIMEOUT = 10 * 1000;
export const PING_DELAY = 10 * 1000;
export const DEBUG = false;

export const DATABASE_API = 'database';
export const NETWORK_BROADCAST_API = 'network_broadcast';
export const HISTORY_API = 'history';
export const REGISTRATION_API = 'registration';
export const ASSET_API = 'asset';
export const LOGIN_API = 'login';
export const NETWORK_NODE_API = 'network_node';

export const CHAIN_APIS = [
	DATABASE_API,
	NETWORK_BROADCAST_API,
	HISTORY_API,
	REGISTRATION_API,
	ASSET_API,
	LOGIN_API,
	NETWORK_NODE_API,
];
export const DEFAULT_CHAIN_APIS = [
	DATABASE_API,
	NETWORK_BROADCAST_API,
	HISTORY_API,
	LOGIN_API,
];

export const STATUS = {
	OPEN: 'OPEN',
	ERROR: 'ERROR',
	CLOSE: 'CLOSE',
};
