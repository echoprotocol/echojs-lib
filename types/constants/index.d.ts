import * as API_CONFIG from './api-config';
import * as CACHE_MAPS from './cache-maps';
import * as CHAIN_CONFIG from './chain-config';
import * as CHAIN_TYPES from './chain-types';
import OBJECT_TYPES = require('./object-types');
import * as WS_CONSTANTS from './ws-constants';
import * as protocol from './protocol';

export const START_OPERATION_ID: string;
export const CORE_ASSET_ID: string;

export { default as ECHORAND_TYPES } from "../interfaces/EchorandTypeId"
export { default as OPERATIONS_IDS } from "../interfaces/OperationId";

export const CANCEL_LIMIT_ORDER: string;
export const UPDATE_CALL_ORDER: string;
export const CLOSE_CALL_ORDER: string;
export const BITASSET_UPDATE: string;

export const ECHO_ASSET_ID: string;
export const DYNAMIC_GLOBAL_OBJECT_ID: string;

export { API_CONFIG, CACHE_MAPS, CHAIN_CONFIG, CHAIN_TYPES, OBJECT_TYPES, WS_CONSTANTS, protocol }
