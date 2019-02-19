import CHAIN_TYPES from './chain-config';
import WS_CONSTANTS from './ws-constants';
import OPERATIONS from './operations-ids';
import * as CACHE_MAPS from './cache-maps';

declare const START_OPERATION_ID = '1.11.0';
declare const CORE_ASSET_ID = '1.3.0';

declare const ECHORAND_TYPES: {
    START_NOTIFICATION: 1,
    BLOCK_NOTIFICATION: 2,
};

declare const CANCEL_LIMIT_ORDER = 'cancel-limit-order';
declare const UPDATE_CALL_ORDER = 'update-call-order';
declare const CLOSE_CALL_ORDER = 'close-call-order';
declare const BITASSET_UPDATE = 'bitasset-update';

export default {
	WS_CONSTANTS,
};
export { default as CHAIN_TYPES } from './chain-types';
export { default as CHAIN_CONFIG } from './chain-config';
export { default as OBJECT_TYPE } from './object-types';
export const ECHO_ASSET_ID = '1.3.0';
export const DYNAMIC_GLOBAL_OBJECT_ID = '2.1.0';
export { OPERATIONS, CACHE_MAPS };
