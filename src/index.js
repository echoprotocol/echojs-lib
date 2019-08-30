/* Chain */
import BigNumber from 'bignumber.js';
import Echo from './echo';
import * as constants from './constants';
import { aes, hash, PrivateKey, PublicKey, ED25519, PrivateKeyECDSA, PublicKeyECDSA } from './crypto';
import Transaction from './echo/transaction';
import echoReducer from './redux/reducer';
import * as validators from './utils/validators';
import * as converters from './utils/converters';
import * as serializers from './serializers';
import Signature from './crypto/signature';

require('buffer');

const { OPERATIONS_IDS, CACHE_MAPS } = constants;

export {
	BigNumber,
	Echo,
	constants,
	PrivateKey,
	PublicKey,
	ED25519,
	Transaction,
	echoReducer,
	validators,
	converters,
	aes,
	hash,
	Signature,
	serializers,
	PrivateKeyECDSA,
	PublicKeyECDSA,
	OPERATIONS_IDS,
	CACHE_MAPS,
};

export { handleConnectionClosedError } from './utils/helpers';

export default new Echo();
