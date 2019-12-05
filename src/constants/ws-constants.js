import * as CHAIN_API from './chain-apis';

export const CONNECTION_TIMEOUT = 5 * 1000;
export const MAX_RETRIES = 1000;
export const PING_TIMEOUT = 10 * 1000;
export const PING_DELAY = 10 * 1000;
export const DEBUG = false;
export const CONNECTION_CLOSED_ERROR_MESSAGE = 'connection closed';

export const CHAIN_APIS = [
	CHAIN_API.DATABASE_API,
	CHAIN_API.NETWORK_BROADCAST_API,
	CHAIN_API.HISTORY_API,
	CHAIN_API.REGISTRATION_API,
	CHAIN_API.ASSET_API,
	CHAIN_API.LOGIN_API,
	CHAIN_API.NETWORK_NODE_API,
];
export const DEFAULT_CHAIN_APIS = [
	CHAIN_API.DATABASE_API,
	CHAIN_API.NETWORK_BROADCAST_API,
	CHAIN_API.HISTORY_API,
	CHAIN_API.LOGIN_API,
];

export const STATUS = {
	OPEN: 'OPEN',
	ERROR: 'ERROR',
	CLOSE: 'CLOSE',
};

export { CHAIN_API };

export const SUBSCRIBERS = [
	'set_subscribe_callback',
	'broadcast_transaction_with_callback',
	'set_pending_transaction_callback',
	'set_block_applied_callback',
	'set_consensus_message_callback',
	'subscribe_contract_logs',
	'submit_registration_solution',
];

/** @typedef {typeof CHAIN_API[keyof typeof CHAIN_API]} ChainApi */
