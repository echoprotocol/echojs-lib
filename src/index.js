/* Chain */
import BigNumber from 'bignumber.js';
import Echo, { echo } from './echo';
import * as constants from './constants';
import { aes, hash, PrivateKey, PublicKey, ED25519, PrivateKeyECDSA, PublicKeyECDSA } from './crypto';
import Transaction from './echo/transaction';
import echoReducer from './redux/reducer';
import * as validators from './utils/validators';
import * as converters from './utils/converters';
import * as serializers from './serializers';
import Signature from './crypto/signature';
import Contract from './contract/Contract';
import encode from './contract/encoders';
import { decode } from './contract/decoders';
import Method from './contract/Method';
import { generateInterface } from './contract';

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
	Contract,
	encode,
	decode,
	Method,
	generateInterface,
};

export { handleConnectionClosedError } from './utils/helpers';

export default echo;
