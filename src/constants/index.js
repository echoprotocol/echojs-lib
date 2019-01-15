import * as OPERATIONS_IDS from './operations-ids';

const START_OPERATION_ID = '1.11.0';

const ECHORAND_TYPES = {
	START_NOTIFICATION: 1,
	BLOCK_NOTIFICATION: 2,
};

export default {
	START_OPERATION_ID,
	ECHORAND_TYPES,
};

export { default as CHAIN_TYPES } from './chain-types';
export { default as CHAIN_CONFIG } from './chain-config';
export const ECHO_ASSET_ID = '1.3.0';
export const DYNAMIC_GLOBAL_OBJECT_ID = '2.1.0';
export { OPERATIONS_IDS };
