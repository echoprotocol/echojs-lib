import * as API_CONFIG from './api-config';
import * as CACHE_MAPS from './cache-maps';
import * as CHAIN_CONFIG from './chain-config';
import * as CHAIN_TYPES from './chain-types';
import * as OBJECT_TYPES from './object-types';
import * as OPERATIONS_IDS from './operations-ids';
import * as WS_CONSTANTS from './ws-constants';

export const START_OPERATION_ID = '1.10.0';
export const CORE_ASSET_ID = '1.3.0';

export const ECHORAND_TYPES = {
	START_NOTIFICATION: 1,
	BLOCK_NOTIFICATION: 2,
};

export const CANCEL_LIMIT_ORDER = 'cancel-limit-order';
export const UPDATE_CALL_ORDER = 'update-call-order';
export const CLOSE_CALL_ORDER = 'close-call-order';
export const BITASSET_UPDATE = 'bitasset-update';

export const ECHO_ASSET_ID = '1.3.0';
export const DYNAMIC_GLOBAL_OBJECT_ID = '2.1.0';

export const USE_CACHE_BY_DEFAULT = true;
export const DEFAULT_BLOCKS_EXPIRATION_NUMBER = 20;
export const DEFAULT_CACHE_EXPIRATION_TIME = null;
export const DEFAULT_MIN_CACHE_CLEANING_TIME = 500;

/** @typedef {typeof OBJECT_TYPES[keyof typeof OBJECT_TYPES]} e_OBJECT_TYPES */

export { OPERATIONS_IDS, CACHE_MAPS, CHAIN_TYPES, CHAIN_CONFIG, API_CONFIG, OBJECT_TYPES, WS_CONSTANTS };
