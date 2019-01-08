import BN from 'bignumber.js';

import ChainConfig from '../config/chain-config';
import { CHAIN_APIS } from '../constants/ws-constants';

const urlRegex = new RegExp(
	'^(https|http|wss|ws):\\/\\/' + // protocol
	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
	'(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])|' + // OR ip (v4) address
	'\\[(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\\])' + // OR ip (v6) address
	'(:(0|[1-9][0-9]{0,3}|[1-6][0-5]{2}[0-3][0-5]))?' + // port
	'(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
	'(\\#[-a-z\\d_]*)?$' // fragment locater
	, 'i',
);
const idRegex = /^\d+\.\d+\.(\d+)$/;

const accountIdRegex = /^1\.2\.[1-9]\d*$/;
const assetIdRegex = /^1\.3\.(0|[1-9]\d*)$/;
const forceSettlementIdRegex = /^1\.4\.[1-9]\d*$/;
const committeeMemberIdRegex = /^1\.5\.[1-9]\d*$/;
const witnessIdRegex = /^1\.6\.[1-9]\d*$/;
const limitOrderIdRegex = /^1\.7\.[1-9]\d*$/;
const callOrderIdRegex = /^1\.8\.[1-9]\d*$/;
const customIdRegex = /^1\.9\.[1-9]\d*$/;
const proposalIdRegex = /^1\.10\.[1-9]\d*$/;
const operationHistoryIdRegex = /^1\.11\.[1-9]\d*$/;
const withdrawPermissionIdRegex = /^1\.12\.[1-9]\d*$/;
const vestingBalanceIdRegex = /^1\.13\.[1-9]\d*$/;
const workerIdRegex = /^1\.14\.[1-9]\d*$/;
const balanceIdRegex = /^1\.15\.[1-9]\d*$/;
const contractIdRegex = /^1\.16\.(0|[1-9]\d*)$/;
const contractResultIdRegex = /^1\.17\.[1-9]\d*$/;

const dynamicAssetDataIdRegex = /^2\.3\.(0|[1-9]\d*)$/;
const bitAssetIdRegex = /^2\.4\.(0|[1-9]\d*)$/;
const accountBalanceIdRegex = /^2\.5\.[1-9]\d*$/;

const hexRegex = /^[0-9a-fA-F]+/;
const bytecodeRegex = /^[\da-fA-F]{8}([\da-fA-F]{64})*$/;
const voteIdTypeRegex = /^[0-3]{1}:[0-9]+/;

const MAX_UINTX_VALUES = {
	64: new BN(2).pow(64).minus(1),
	32: new BN(2).pow(32).minus(1),
	16: new BN(2).pow(16).minus(1),
	8: new BN(2).pow(8).minus(1),
};

const MAX_INTX_VALUES = {
	64: new BN(2).pow(63).minus(1),
	32: new BN(2).pow(31).minus(1),
	16: new BN(2).pow(15).minus(1),
	8: new BN(2).pow(7).minus(1),
};


export const validateUrl = (url) => urlRegex.test(String(url));

export const isString = (v) => typeof v === 'string';

export const isEmpty = (v) => v === null || typeof v === 'undefined' || (typeof v.length !== 'undefined' && v.length === 0);

export const isVoid = (v) => v === null || typeof v === 'undefined';

export const isArray = (v) => Array.isArray(v) && !isEmpty(v.length);

export const isEmptyArray = (v) => Array.isArray(v) && v.length === 0;

export const isNumber = (v) => v && typeof v === 'number';

const isUInt = (v, x) => {
	if (isNumber(v) && v > Number.MAX_SAFE_INTEGER) return false;
	const bn = new BN(v);
	return bn.isInteger() && bn.gte(0) && bn.lte(MAX_UINTX_VALUES[x]);
};

const isInt = (v, x) => {
	if (isNumber(v) && (v > Number.MAX_SAFE_INTEGER || v < Number.MIN_SAFE_INTEGER)) return false;
	const bn = new BN(v);
	return bn.isInteger() && bn.abs().lte(MAX_INTX_VALUES[x]);
};

export const isUInt64 = (v) => isUInt(v, 64);

export const isUInt32 = (v) => isUInt(v, 32);

export const isUInt16 = (v) => isUInt(v, 16);

export const isUInt8 = (v) => isUInt(v, 8);

export const isInt64 = (v) => isInt(v, 64);

export const isFunction = (v) => typeof v === 'function';

export const isBoolean = (v) => typeof v === 'boolean';

export const isObject = (v) => typeof v === 'object';

export const isEmptyObject = (v) => isObject(v) && Object.keys(v).length === 0;

export const isAccountId = (v) => isString(v) && accountIdRegex.test(v);
export const isAssetId = (v) => isString(v) && assetIdRegex.test(v);

export const isForceSettlementId = (v) => isString(v) && forceSettlementIdRegex.test(v);
export const isCommitteeMemberId = (v) => isString(v) && committeeMemberIdRegex.test(v);
export const isWitnessId = (v) => isString(v) && witnessIdRegex.test(v);
export const isLimitOrderId = (v) => isString(v) && limitOrderIdRegex.test(v);
export const isCallOrderId = (v) => isString(v) && callOrderIdRegex.test(v);
export const isCustomId = (v) => isString(v) && customIdRegex.test(v);
export const isProposalId = (v) => isString(v) && proposalIdRegex.test(v);
export const isOperationHistoryId = (v) => isString(v) && operationHistoryIdRegex.test(v);
export const isWithdrawPermissionId = (v) => isString(v) && withdrawPermissionIdRegex.test(v);
export const isVestingBalanceId = (v) => isString(v) && vestingBalanceIdRegex.test(v);
export const isWorkerId = (v) => isString(v) && workerIdRegex.test(v);
export const isBalanceId = (v) => isString(v) && balanceIdRegex.test(v);
export const isContractId = (v) => isString(v) && contractIdRegex.test(v);
export const isContractResultId = (v) => isString(v) && contractResultIdRegex.test(v);

export const isAccountBalanceId = (v) => isString(v) && accountBalanceIdRegex.test(v);

export const isVoteId = (v) => isString(v) && voteIdTypeRegex.test(v);

export const isObjectId = (v) => {
	if (!isString(v)) return false;

	const match = idRegex.exec(v);
	return (match !== null && v.split('.').length === 3);

};

export const isBuffer = (v) => Buffer.isBuffer(v);

export const isHex = (v) => isString(v) && hexRegex.test(v);

export const isBytes = (v, length) => isHex(v) && v.length === length * 2;

export const isBytecode = (v) => isString(v) && bytecodeRegex.test(v);

export const isRipemd160 = (v) => isHex(v) && v.length === 40;

export const isAssetName = (v) =>
	!isEmpty(v) &&
    (v.split('.').length <= 2) &&
    (v.length >= 3) &&
    (v.length <= 16) &&
    (/^[A-Z]/.test(v)) &&
    (/[A-Z]$/.test(v)) &&
    (!/^[A-Z0-9.]$/.test(v));

export const isBitAssetId = (v) => isString(v) && bitAssetIdRegex.test(v);

export const isDynamicAssetDataId = (v) => isString(v) && dynamicAssetDataIdRegex.test(v);

export const isPublicKey = (v, addressPrefix = ChainConfig.ADDRESS_PREFIX) => {

	if (!isString(v) || v.length !== (ChainConfig.PUBLIC_KEY_LENGTH + addressPrefix.length)) return false;

	const prefix = v.slice(0, addressPrefix.length);

	return addressPrefix === prefix;
};

export const isEchoRandKey = (v, echorandPrefix = ChainConfig.ECHORAND_PREFIX) => {

	if (!isString(v) || v.length !== (ChainConfig.ECHORAND_KEY_LENGTH + echorandPrefix.length)) return false;

	const prefix = v.slice(0, echorandPrefix.length);

	return echorandPrefix === prefix;
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

	return errorParameter ? `Parameter ${errorParameter} is invalid` : false;
};

export const isTimePointSec = (v) => {
	if (!isString(v)) return false;

	try {
		return new Date(v).toISOString();
	} catch (error) {
		return false;
	}
};
