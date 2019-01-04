import CHAIN_TYPES from './chain-types';
import CHAIN_CONFIG from './chain-config';

const START_OPERATION_ID = '1.11.0';

const ECHORAND_TYPES = {
	START_NOTIFICATION: 1,
	BLOCK_NOTIFICATION: 2,
};

const CANCEL_LIMIT_ORDER = 'cancel-limit-order';
const CLOSE_CALL_ORDER = 'close-call-order';

export default {
	CHAIN_TYPES,
	CHAIN_CONFIG,
	START_OPERATION_ID,
	ECHORAND_TYPES,
	CANCEL_LIMIT_ORDER,
	CLOSE_CALL_ORDER,
};
