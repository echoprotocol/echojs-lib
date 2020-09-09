/* eslint-disable max-len */
import BN from 'bignumber.js';
import bs58 from 'bs58';

import { ADDRESS_PREFIX, LENGTH_DECODE_PRIVATE_KEY, LENGTH_DECODE_PUBLIC_KEY } from '../config/chain-config';
import { CHAIN_APIS } from '../constants/ws-constants';
import { PROTOCOL_OBJECT_TYPE_ID, CHAIN_TYPES, AMOUNT_MAX_NUMBER, ECHO_MAX_SHARE_SUPPLY, chain } from '../constants';
import { walletAPIMethodsArray, operationPrototypeArray } from './methods-operations-data';

export function validateSafeInteger(value, fieldName) {
	if (typeof value !== 'number') throw new Error(`${fieldName} is not a number`);
	if (!Number.isInteger(value)) throw new Error(`${fieldName} is not a integer`);
}

export function validatePositiveSafeInteger(value) {
	validateSafeInteger(value);
	if (value <= 0) throw new Error('value is not positive');
}

export function validateUnsignedSafeInteger(value, fieldName = 'value') {
	validateSafeInteger(value, fieldName);
	if (value < 0) throw new Error(`${fieldName} is negative`);
}

const urlRegex = new RegExp(
	'^(https|http|wss|ws):\\/\\/' + // protocol
	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
	'(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])|' + // OR ip (v4) address
	'\\[(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\\])' + // OR ip (v6) address
	'(:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?' + // port
	'(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
	'(\\#[-a-z\\d_]*)?$' // fragment locater
	, 'i',
);
export const idRegex = /^([1-9]\d*)(\.(0|([1-9]\d*))){2}$/;

function generateProtocolObjectIdRegExp(protocolObjectId) {
	return new RegExp(`^1\\.${protocolObjectId}\\.(0|[1-9]\\d*)$`);
}

function generateProtocolImplObjectIdRegExp(ImplObjectId) {
	return new RegExp(`^2\\.${ImplObjectId}\\.(0|[1-9]\\d*)$`);
}

const accountIdRegex = generateProtocolObjectIdRegExp(PROTOCOL_OBJECT_TYPE_ID.ACCOUNT);
const assetIdRegex = generateProtocolObjectIdRegExp(PROTOCOL_OBJECT_TYPE_ID.ASSET);
const committeeMemberIdRegex = generateProtocolObjectIdRegExp(PROTOCOL_OBJECT_TYPE_ID.COMMITTEE_MEMBER);
const proposalIdRegex = generateProtocolObjectIdRegExp(PROTOCOL_OBJECT_TYPE_ID.PROPOSAL);
const operationHistoryIdRegex = generateProtocolObjectIdRegExp(PROTOCOL_OBJECT_TYPE_ID.OPERATION_HISTORY);
const vestingBalanceIdRegex = generateProtocolObjectIdRegExp(PROTOCOL_OBJECT_TYPE_ID.VESTING_BALANCE);
const balanceIdRegex = generateProtocolObjectIdRegExp(PROTOCOL_OBJECT_TYPE_ID.BALANCE);
const frozenBalanceIdRegex = generateProtocolObjectIdRegExp(PROTOCOL_OBJECT_TYPE_ID.FROZEN_BALANCE);
const contractIdRegex = generateProtocolObjectIdRegExp(PROTOCOL_OBJECT_TYPE_ID.CONTRACT);
const contractResultIdRegex = generateProtocolObjectIdRegExp(PROTOCOL_OBJECT_TYPE_ID.CONTRACT_RESULT);
const ethAddressIdRegex = generateProtocolObjectIdRegExp(PROTOCOL_OBJECT_TYPE_ID.ETH_ADDRESS);
const btcAddressIdRegex = generateProtocolObjectIdRegExp(PROTOCOL_OBJECT_TYPE_ID.BTC_ADDRESS);
const erc20TokenIdRegex = generateProtocolObjectIdRegExp(PROTOCOL_OBJECT_TYPE_ID.ERC20_TOKEN);

const dynamicGlobalObjectIdRegex = new RegExp(`^2\\.${CHAIN_TYPES.IMPLEMENTATION_OBJECT_TYPE_ID.DYNAMIC_GLOBAL_PROPERTY}\\.0$`);
const dynamicAssetDataIdRegex = generateProtocolImplObjectIdRegExp(CHAIN_TYPES.IMPLEMENTATION_OBJECT_TYPE_ID.ASSET_DYNAMIC_DATA);
const bitAssetIdRegex = generateProtocolImplObjectIdRegExp(CHAIN_TYPES.IMPLEMENTATION_OBJECT_TYPE_ID.ASSET_BITASSET_DATA);
const accountBalanceIdRegex = generateProtocolImplObjectIdRegExp(CHAIN_TYPES.IMPLEMENTATION_OBJECT_TYPE_ID.ACCOUNT_BALANCE);
const accountStatisticsIdRegex = generateProtocolImplObjectIdRegExp(CHAIN_TYPES.IMPLEMENTATION_OBJECT_TYPE_ID.ACCOUNT_STATISTICS);
const transactionDedupeIdRegex = generateProtocolImplObjectIdRegExp(CHAIN_TYPES.IMPLEMENTATION_OBJECT_TYPE_ID.TRANSACTION_DEDUPE);
const blockSummaryIdRegex = generateProtocolImplObjectIdRegExp(CHAIN_TYPES.IMPLEMENTATION_OBJECT_TYPE_ID.BLOCK_SUMMARY);
const accountTransactionHistoryIdRegex = generateProtocolImplObjectIdRegExp(CHAIN_TYPES.IMPLEMENTATION_OBJECT_TYPE_ID.ACCOUNT_TRANSACTION_HISTORY);
const contractHistoryIdRegex = generateProtocolImplObjectIdRegExp(CHAIN_TYPES.IMPLEMENTATION_OBJECT_TYPE_ID.CONTRACT_HISTORY);
const contractPoolIdRegex = generateProtocolImplObjectIdRegExp(CHAIN_TYPES.IMPLEMENTATION_OBJECT_TYPE_ID.CONTRACT_POOL);
const accountAddressRegex = generateProtocolImplObjectIdRegExp(CHAIN_TYPES.IMPLEMENTATION_OBJECT_TYPE_ID.ACCOUNT_ADDRESS);

const hexRegex = /^[0-9a-fA-F]+/;
const bytecodeRegex = /^[\da-fA-F0-9]{8}([\da-fA-F0-9]{64})*$/;
const voteIdTypeRegex = /^[0]{1}:[0-9]+/;
const amountRegex = /^(-?)([1-9](\d)*|0)(\.\d{0,11}[1-9])?$/;

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

const NAME_MIN_LENGTH = 1;
const NAME_MAX_LENGTH = 63;

export const validateUrl = (url) => urlRegex.test(String(url));

export const isString = (v) => typeof v === 'string';

export const isEmpty = (v) => v === null || typeof v === 'undefined' || (typeof v.length !== 'undefined' && v.length === 0);

export const isVoid = (v) => v === null || typeof v === 'undefined';

export const isUndefined = (v) => typeof v === 'undefined';

export const isArray = (v) => Array.isArray(v) && !isEmpty(v.length);

export const isEmptyArray = (v) => Array.isArray(v) && v.length === 0;

export const isNumber = (v) => typeof v === 'number';

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

export const isObject = (v) => typeof v === 'object' && v !== null;

export const isEmptyObject = (v) => isObject(v) && Object.keys(v).length === 0;

export const isAccountId = (v) => isString(v) && accountIdRegex.test(v);
export const isAccountAddressId = (v) => isString(v) && accountAddressRegex.test(v);
export const isAssetId = (v) => isString(v) && assetIdRegex.test(v);
export const isBtcAddressId = (v) => isString(v) && btcAddressIdRegex.test(v);
export const isERC20TokenId = (v) => isString(v) && erc20TokenIdRegex.test(v);
export const isEthAddressId = (v) => isString(v) && ethAddressIdRegex.test(v);

export const isCommitteeMemberId = (v) => isString(v) && committeeMemberIdRegex.test(v);
export const isProposalId = (v) => isString(v) && proposalIdRegex.test(v);
export const isOperationHistoryId = (v) => isString(v) && operationHistoryIdRegex.test(v);
export const isVestingBalanceId = (v) => isString(v) && vestingBalanceIdRegex.test(v);
export const isBalanceId = (v) => isString(v) && balanceIdRegex.test(v);
export const isFrozenBalanceId = (v) => isString(v) && frozenBalanceIdRegex.test(v);
export const isContractId = (v) => isString(v) && contractIdRegex.test(v);
export const isContractResultId = (v) => isString(v) && contractResultIdRegex.test(v);

export const isAccountBalanceId = (v) => isString(v) && accountBalanceIdRegex.test(v);
export const isOperationId = (v) => isUInt8(v) && v < 49;

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

export const isEthereumAddress = (v) => isBytes(v, 20);

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


export const isAccountStatisticsId = (v) => isString(v) && accountStatisticsIdRegex.test(v);
export const isTransactionId = (v) => isString(v) && transactionDedupeIdRegex.test(v);
export const isBlockSummaryId = (v) => isString(v) && blockSummaryIdRegex.test(v);
export const isAccountTransactionHistoryId = (v) => (
	isString(v) && accountTransactionHistoryIdRegex.test(v)
);
export const isContractHistoryId = (v) => isString(v) && contractHistoryIdRegex.test(v);
export const isContractPoolId = (v) => isString(v) && contractPoolIdRegex.test(v);
export const isDynamicGlobalObjectId = (v) => isString(v) && dynamicGlobalObjectIdRegex.test(v);

export const isPublicKey = (v, addressPrefix = ADDRESS_PREFIX) => {
	if (!isString(v)) return false;

	const prefix = v.slice(0, addressPrefix.length);

	if (addressPrefix !== prefix || bs58.decode(v.slice(addressPrefix.length)).length !== LENGTH_DECODE_PUBLIC_KEY) {
		return false;
	}

	return true;
};

export const isEchoRandKey = (v, echorandPrefix = ADDRESS_PREFIX) => isPublicKey(v, echorandPrefix);

export const isAccountName = (v) => {
	if (!isString(v)) {
		return false;
	}

	if (isEmpty(v)) {
		return false;
	}

	const { length } = v;

	if (length < NAME_MIN_LENGTH || length > NAME_MAX_LENGTH) {
		return false;
	}

	const ref = v.split('.');

	for (let i = 0; i < ref.length; i += 1) {

		const label = ref[i];

		if (!(/^[a-z][a-z0-9-]*$/.test(label) && label.length >= NAME_MIN_LENGTH)) {
			return false;
		}

	}
	return true;
};

/**
 * @method checkAccountName
 *
 * Return name of error if account name is invalid
 *
 * @param {String} value
 */
export const checkAccountName = (value) => {
	let suffix = 'Account name should';

	if (value == null || value.length === 0) {
		return `${suffix} not be empty.`;
	}

	if (value.length < NAME_MIN_LENGTH) {
		return `${suffix} be longer.`;
	}

	if (value.length > NAME_MAX_LENGTH) {
		return `${suffix} be shorter.`;
	}

	if (/\./.test(value)) {
		suffix = 'Each account segment should';
	}

	const ref = value.split('.');

	for (let i = 0; i < ref.length; i += 1) {
		const label = ref[i];
		if (!/^[a-z]/.test(label)) {
			return `${suffix} start with a lowercase letter.`;
		}
		if (!/^[a-z0-9-]*$/.test(label)) {
			return `${suffix} have only lowercase letters, digits, or dashes.`;
		}
		if (!/[a-z0-9]$/.test(label)) {
			return `${suffix} end with a lowercase letter or digit.`;
		}
		if (!(label.length >= NAME_MIN_LENGTH)) {
			return `${suffix} be longer.`;
		}
	}

	return null;
};

/**
 * @method checkCheapName
 *
 * Check cheap name
 *
 * @param {String} name
 * @deprecated
 */
export const checkCheapName = (name) => /[a-z0-9-]/.test(name) || !/[aeiouy]/.test(name);

export const validateOptionsError = (options) => {
	if (!options || typeof options !== 'object') return 'Options should be an object';

	let errorParameter;
	if (!(Number.isInteger(options.connectionTimeout) || typeof options.connectionTimeout === 'undefined')) {
		errorParameter = 'connectionTimeout';
	} else if (!(Number.isInteger(options.maxRetries) || typeof options.maxRetries === 'undefined')) {
		errorParameter = 'maxRetries';
	} else if (!(Number.isInteger(options.pingTimeout) || typeof options.pingTimeout === 'undefined')) {
		errorParameter = 'pingTimeout';
	} else if (!(Number.isInteger(options.pingDelay) || typeof options.pingDelay === 'undefined')) {
		errorParameter = 'pingDelay';
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

export const isAccountIdOrName = (v) => isAccountId(v) || isAccountName(v);

export const isAssetIdOrName = (v) => isAssetId(v) || isAssetName(v);

export const isMethodExists = (v) => walletAPIMethodsArray.includes(v);

export const isOperationPrototypeExists = (v) => operationPrototypeArray.includes(v);

export const isNotEmptyString = (v) => isString(v) && !!v.trim();

export const isContractCode = (v) => v === '' || (isHex(v) && v.length % 2 === 0);

export const isOldPrivateKey = (v) => isString(v) && bs58.decode(v).length === LENGTH_DECODE_PRIVATE_KEY;

export const isValidAmount = (v) => {
	if (!isString(v)) return false;

	const integer = new BN(v.split('.')[0]).absoluteValue();

	if (integer.gt(AMOUNT_MAX_NUMBER)) return false;

	return integer.times(1e12).lt(ECHO_MAX_SHARE_SUPPLY) && amountRegex.test(v);
};

/** @param {string} v */
export function validateSidechainType(v) {
	if (typeof v !== 'string') throw new Error('Type is not a string');
	if (!['', 'eth', 'btc'].includes(v)) throw new Error(`Unsupported withdrawal type "${v}"`);
}

/**
 * @param {number|BN|string} v
 * @returns {string}
 */
export function validateAmount(v) {
	if (typeof v === 'number' || typeof v === 'string') v = new BN(v);
	if (!(v instanceof BN)) throw new Error('amount: invalid type');
	if (v.isNaN()) throw new Error('amount: not a number');
	const dp = v.dp();
	if (dp > 12) throw new Error('amont: invalid precision');
	const minSatoshis = v.times(`1e${dp.toString(10)}`).abs();
	if (minSatoshis > chain.config.ECHO_MAX_SHARE_SUPPLY) throw new Error('amount: overflow');
	return v.toString(10);
}
