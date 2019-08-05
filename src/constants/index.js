import CHAIN_TYPES from './chain-types';
import CHAIN_CONFIG from './chain-config';
import WS_CONSTANTS from './ws-constants';
import * as OPERATIONS_IDS from './operations-ids';
import * as CACHE_MAPS from './cache-maps';
import * as API_CONFIG from './api-config';
import * as OBJECT_TYPES from './object-types';

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

export default {
	CHAIN_TYPES,
	CHAIN_CONFIG,
	WS_CONSTANTS,
	START_OPERATION_ID,
	CORE_ASSET_ID,
	ECHORAND_TYPES,
	CANCEL_LIMIT_ORDER,
	UPDATE_CALL_ORDER,
	CLOSE_CALL_ORDER,
	BITASSET_UPDATE,
	CACHE_MAPS,
	OPERATIONS_IDS,
	API_CONFIG,
	OBJECT_TYPES,
};

export const ECHO_ASSET_ID = '1.3.0';
export const DYNAMIC_GLOBAL_OBJECT_ID = '2.1.0';
export { OPERATIONS_IDS, CACHE_MAPS, CHAIN_TYPES, CHAIN_CONFIG };

export const IS_USE_CACHE = true;
export const CACHE_EXPIRE_TIME = 60 * 60 * 1000;
