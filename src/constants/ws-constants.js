export const CONNECTION_TIMEOUT = 5 * 1000;
export const MAX_RETRIES = 1000;
export const PING_TIMEOUT = 10 * 1000;
export const PING_DELAY = 10 * 1000;
export const DEBUG = false;
export const CONNECTION_CLOSED_ERROR_MESSAGE = 'connection closed';

export const ChainApi = {
	DATABASE_API: 'database',
	NETWORK_BROADCAST_API: 'network_broadcast',
	HISTORY_API: 'history',
	REGISTRATION_API: 'registration',
	ASSET_API: 'asset',
	LOGIN_API: 'login',
	NETWORK_NODE_API: 'network_node',
};

export const CHAIN_APIS = [
	ChainApi.DATABASE_API,
	ChainApi.NETWORK_BROADCAST_API,
	ChainApi.HISTORY_API,
	ChainApi.REGISTRATION_API,
	ChainApi.ASSET_API,
	ChainApi.LOGIN_API,
	ChainApi.NETWORK_NODE_API,
];
export const DEFAULT_CHAIN_APIS = [
	ChainApi.DATABASE_API,
	ChainApi.NETWORK_BROADCAST_API,
	ChainApi.HISTORY_API,
	ChainApi.LOGIN_API,
];

export const STATUS = {
	OPEN: 'OPEN',
	ERROR: 'ERROR',
	CLOSE: 'CLOSE',
};
