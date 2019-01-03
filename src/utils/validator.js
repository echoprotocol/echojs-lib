/* eslint-disable import/prefer-default-export */
import { CHAIN_APIS } from '../constants/ws-constants';

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

export const isFunction = (v) => typeof v === 'function';
