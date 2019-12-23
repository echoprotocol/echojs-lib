import BigNumber from 'bignumber.js';

import * as API_CONFIG from './api-config';
import * as CACHE_MAPS from './cache-maps';
import * as chain from './chain';
import * as CHAIN_CONFIG from './chain-config';
import * as CHAIN_TYPES from './chain-types';
import * as PROTOCOL_OBJECT_TYPE_ID from './object-types';
import * as OPERATIONS_IDS from './operations-ids';
import * as WS_CONSTANTS from './ws-constants';
import * as protocol from './protocol';
import * as NET from './net';

export const START_OPERATION_ID = `1.${PROTOCOL_OBJECT_TYPE_ID.OPERATION_HISTORY}.0`;
export const CORE_ASSET_ID = `1.${PROTOCOL_OBJECT_TYPE_ID.ASSET}.0`;

export const ECHORAND_TYPES = {
	START_NOTIFICATION: 1,
	BLOCK_NOTIFICATION: 2,
};

export const CANCEL_LIMIT_ORDER = 'cancel-limit-order';
export const UPDATE_CALL_ORDER = 'update-call-order';
export const CLOSE_CALL_ORDER = 'close-call-order';
export const BITASSET_UPDATE = 'bitasset-update';

export const ECHO_ASSET_ID = `1.${PROTOCOL_OBJECT_TYPE_ID.ASSET}.0`;
export const DYNAMIC_GLOBAL_OBJECT_ID = `2.${CHAIN_TYPES.IMPLEMENTATION_OBJECT_TYPE_ID.DYNAMIC_GLOBAL_PROPERTY}.0`;

export const USE_CACHE_BY_DEFAULT = true;
export const DEFAULT_BLOCKS_EXPIRATION_NUMBER = 20;
export const DEFAULT_CACHE_EXPIRATION_TIME = null;
export const DEFAULT_MIN_CACHE_CLEANING_TIME = 500;

/** @typedef {typeof PROTOCOL_OBJECT_TYPE_ID[keyof typeof PROTOCOL_OBJECT_TYPE_ID]} ProtocolObjectTypeId */
/** @typedef {typeof OPERATIONS_IDS[keyof typeof OPERATIONS_IDS]} OperationId */

export {
	chain,
	OPERATIONS_IDS,
	CACHE_MAPS,
	CHAIN_TYPES,
	CHAIN_CONFIG,
	API_CONFIG,
	PROTOCOL_OBJECT_TYPE_ID,
	WS_CONSTANTS,
	protocol,
	NET,
};

export const AMOUNT_MAX_NUMBER = new BigNumber(2).pow(63).minus(1);
export const ECHO_MAX_SHARE_SUPPLY = 1000000000000000;
