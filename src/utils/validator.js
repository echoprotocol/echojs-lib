import { decode } from 'bs58';

import { ripemd160 } from '../crypto/hash';
import { CHAIN_CONFIG } from '../constants';

/* eslint-disable import/prefer-default-export */
import { CHAIN_APIS } from '../constants/ws-constants';

const idRegex = /\b\d+\.\d+\.(\d+)\b/;
const accountIdRegex = /1\.2\.(\d+)\b/;
const assetIdRegex = /1\.3\.(\d+)\b/;
const balanceIdRegex = /2\.5\.(\d+)\b/;

export const isArray = (v) => Array.isArray(v) && v.length !== undefined;

export const isString = (v) => typeof v === 'string';

export const isEmpty = (v) => v === null || v.length === 0;

export const isNumber = (v) => v && typeof v === 'number';

export const isNonNegativeInteger = (v) => Number.isInteger(v) && v >= 0;

export const isFunction = (v) => typeof v === 'function';

export const isBoolean = (v) => typeof v === 'boolean';

export const isStringSymbol = (v) => isString(v) && v.length === 1;

export const isAccountId = (v) => isString(v) && accountIdRegex.test(v);

export const isAssetId = (v) => isString(v) && assetIdRegex.test(v);

export const isBalanceId = (v) => isString(v) && balanceIdRegex.test(v);

export const isValidAssetName = (v) =>
	!isEmpty(v) &&
	(v.split('.').length <= 2) &&
	(v.length >= 3) &&
	(v.length <= 16) &&
	(/^[A-Z]/.test(v)) &&
	(/[A-Z]$/.test(v)) &&
	(!/^[A-Z0-9.]$/.test(v));

export const isObjectId = (v) => {
	if (!isString(v)) return false;

	const match = idRegex.exec(v);
	return (match !== null && v.split('.').length === 3);

};

export const isPublicKey = (publicKey, addressPrefix = CHAIN_CONFIG.ADDRESS_PREFIX) => {

	if (!isString(publicKey) || publicKey.length !== (44 + addressPrefix.length)) return false;

	const prefix = publicKey.slice(0, addressPrefix.length);

	if (addressPrefix !== prefix) return false;

	publicKey = publicKey.slice(addressPrefix.length);

	publicKey = Buffer.from(decode(publicKey), 'binary');
	const checksum = publicKey.slice(-4);
	publicKey = publicKey.slice(0, -4);
	let newChecksum = ripemd160(publicKey);
	newChecksum = newChecksum.slice(0, 4).toString('hex');
	return checksum === newChecksum;
};

export const isAccountName = (v) => {
	if (!isString(v)) return false;

	if (isEmpty(v)) {
		return false;
	}

	const { length } = v;

	if (length < 3 || length > 63) {
		return false;
	}

	const ref = v.split('.');

	for (let i = 0; i < ref.length; i += 1) {

		const label = ref[i];

		if (!(/^[a-z][a-z0-9-]*$/.test(label) && !/--/.test(label) && /[a-z0-9]$/.test(label))) {
			return false;
		}

	}
	return true;
};

const pattern = new RegExp(
	'^(https|http|wss|ws):\\/\\/' + // protocol
	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
	'(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])|' + // OR ip (v4) address
	'\\[(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\\])' + // OR ip (v6) address
	'(:(0|[1-9][0-9]{0,3}|[1-6][0-5]{2}[0-3][0-5]))?' + // port
	'(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
	'(\\#[-a-z\\d_]*)?$' // fragment locater
	, 'i',
);

export const validateUrl = (url) => pattern.test(String(url));

export const validateOptionsError = (options) => {
	if (!options || typeof options !== 'object') return 'Options should be an object';

	let errorParameter;
	if (!(Number.isInteger(options.connectionTimeout) || typeof options.connectionTimeout === 'undefined')) {
		errorParameter = 'connectionTimeout';
	} else if (!(Number.isInteger(options.maxRetries) || typeof options.maxRetries === 'undefined')) {
		errorParameter = 'maxRetries';
	} else if (!(Number.isInteger(options.pingTimeout) || typeof options.pingTimeout === 'undefined')) {
		errorParameter = 'pingTimeout';
	} else if (!(Number.isInteger(options.pingInterval) || typeof options.pingInterval === 'undefined')) {
		errorParameter = 'pingInterval';
	} else if (!(typeof options.debug === 'boolean' || typeof options.debug === 'undefined')) {
		errorParameter = 'debug';
	} else if (!((Array.isArray(options.apis) && options.apis.every((api) => CHAIN_APIS.includes(api))) || typeof options.apis === 'undefined')) {
		errorParameter = 'apis';
	}

	if (errorParameter) return `Parameter ${errorParameter} is invalid`;
	return null;
};
