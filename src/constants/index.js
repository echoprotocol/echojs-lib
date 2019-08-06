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

export { CHAIN_TYPES, CHAIN_CONFIG, WS_CONSTANTS, OPERATIONS_IDS, CACHE_MAPS, API_CONFIG, OBJECT_TYPES };
