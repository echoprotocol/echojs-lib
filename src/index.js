/* Chain */
import Echo from './echo';
import constants from './constants';
import { aes, hash, PrivateKey, PublicKey, ED25519, PrivateKeyECDSA, PublicKeyECDSA } from './crypto';
import Transaction from './echo/transaction';
import echoReducer from './redux/reducer';
import * as validators from './utils/validators';
import * as converters from './utils/converters';
import serializer from './serializer';
import Signature from './crypto/signature';

require('buffer');

export { OPERATIONS_IDS, CACHE_MAPS } from './constants';

export {
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
	serializer,
	PrivateKeyECDSA,
	PublicKeyECDSA,
};

export { handleConnectionClosedError } from './utils/helpers';

export default new Echo();
