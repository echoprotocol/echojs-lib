export const CONNECTION_TIMEOUT = 5 * 1000;
export const MAX_RETRIES = 0;
export const PING_TIMEOUT = 13 * 1000;
export const PING_INTERVAL = 20 * 1000;
export const DEBUG = false;
export const CHAIN_APIS = ['database', 'network_broadcast', 'history', 'registration', 'asset', 'login'];
export const DEFAULT_CHAIN_APIS = ['database', 'network_broadcast', 'history', 'login'];

export const SOCKET_STATUS = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
};