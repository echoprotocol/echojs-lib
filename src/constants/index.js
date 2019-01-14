import CHAIN_TYPES from './chain-types';
import CHAIN_CONFIG from './chain-config';
import WS_CONSTANTS from './ws-constants';

const START_OPERATION_ID = '1.11.0';
const CORE_ASSET_ID = '1.3.0';

const ECHORAND_TYPES = {
	START_NOTIFICATION: 1,
	BLOCK_NOTIFICATION: 2,
};

const CANCEL_LIMIT_ORDER = 'cancel-limit-order';
const UPDATE_CALL_ORDER = 'update-call-order';
const CLOSE_CALL_ORDER = 'close-call-order';
const BITASSET_UPDATE = 'bitasset-update';

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
};
