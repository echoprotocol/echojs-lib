import * as CACHE_MAPS from './cache-maps';
import * as API_CONFIG from './api-config';
import * as OBJECT_TYPES from './object-types';

export declare const START_OPERATION_ID: string;
export declare const CORE_ASSET_ID: string;

export declare const ECHO_ASSET_ID: string;
export declare const DYNAMIC_GLOBAL_OBJECT_ID: string;

export declare const CANCEL_LIMIT_ORDER: string;
export declare const UPDATE_CALL_ORDER: string;
export declare const CLOSE_CALL_ORDER: string;
export declare const BITASSET_UPDATE: string;

declare interface ECHORAND_TYPES {
    START_NOTIFICATION: number,
    BLOCK_NOTIFICATION: number,
}

declare let _default: {
    START_OPERATION_ID: string,
    CORE_ASSET_ID: string,
    CANCEL_LIMIT_ORDER: string,
    UPDATE_CALL_ORDER: string,
    CLOSE_CALL_ORDER: string,
    BITASSET_UPDATE: string,
    ECHORAND_TYPES: ECHORAND_TYPES,
    CACHE_MAPS: import('./cache-maps').CacheMaps,
    API_CONFIG: import('./api-config').ApiConfig,
    OBJECT_TYPES: import('./object-types').ObjectTypes,
    CHAIN_TYPES: import('./chain-types').ChainTypes,
    CHAIN_CONFIG: import('./chain-config').ChainConfig,
    WS_CONSTANTS: import('./ws-constants').WsConstants,
    OPERATIONS_IDS: typeof import('./operations-ids').OPERATIONS_IDS,
};

export default _default;

export { CACHE_MAPS, API_CONFIG, OBJECT_TYPES };
