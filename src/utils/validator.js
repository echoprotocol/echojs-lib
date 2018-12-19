import { decode } from 'bs58';

import { ripemd160 } from '../crypto/hash'
import ChainConfig from '../config/chain-config'

const idRegex = /\b\d+\.\d+\.(\d+)\b/;
const accountIdRegex = /1\.2\.(\d+)\b/;
const assetIdRegex = /1\.3\.(\d+)\b/;
const balanceIdRegex = /2\.5\.(\d+)\b/;
const contractIdRegex = /1\.16\.(\d+)\b/;
const contractResultIdRegex = /1\.17\.(\d+)\b/;
const hexRegex = /[0-9a-fA-F]+/;
const bytecodeRegex = /[0-9a-fA-F]*/;
const voteIdTypeRegex = /[0-3]{1}:[0-9]+/;

export const isArray = (v) => Array.isArray(v) && v.length !== undefined;

export const isString = (v) => typeof v === 'string';

export const isEmpty = (v) => v === null || v.length === 0;

export const isNumber = (v) => v && typeof v === 'number';

export const isNonNegativeInteger = (v) => Number.isInteger(v) && v >= 0;

export const isFunction = (v) => typeof v === 'function';

export const isBoolean = (v) => typeof v === 'boolean';

export const isObject = (v) => typeof v === 'object';

export const isStringSymbol = (v) => isString(v) && v.length === 1;

export const isAccountId = (v) => isString(v) && accountIdRegex.test(v);

export const isAssetId = (v) => isString(v) && assetIdRegex.test(v);

export const isBalanceId = (v) => isString(v) && balanceIdRegex.test(v);

export const isContractId = (v) => isString(v) && contractIdRegex.test(v);

export const isVoteIdType = (v) => isString(v) && voteIdTypeRegex.test(v);

export const isContractResultId = (v) => isString(v) && contractResultIdRegex.test(v);

export const isHex = (v) => isString(v) && hexRegex.test(v);

export const isBytecode = (v) => isString(v) && bytecodeRegex.test(v) && v.length%2 === 0;

export const isRipemd160 = (v) => isHex(v) && v.length === 40;

export const isTransaction = (v) => {
    return isObjectId(v);
};

export const isOperation = (v) =>
    isArray(v) &&
    isNonNegativeInteger(v[0]) && // operation
    isObject(v[1]) && // operation body
    isObject(v[1].fee) && // fee object
    isString(v[1].fee.amount) && // fee amount
    isAssetId(v[1].fee.asset_id) && // fee asset
    isObject(v[1].amount) && // amount object
    isString(v[1].amount.amount) && // amount sum
    isAssetId(v[1].amount.asset_id) && // amount asset
    isArray(v[1].extensions) && // extension
    isAccountId(v[1].from) && // from id
    isAccountId(v[1].to); // to id


export const isSignetTransaction = (v) =>
    isObject(v) &&
    isNonNegativeInteger(v.ref_block_num) &&
    isNonNegativeInteger(v.ref_block_prefix) &&
    isString(v.expiration) && // date
    isArray(v.operations) &&
    v.operations.every((op) => isOperation(op)) &&
    isArray(v.extensions) &&
    isArray(v.signatures);



export const isAssetName = (v) =>
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

export const isPublicKey = (v, addressPrefix = ChainConfig.ADDRESS_PREFIX) => {

    if (!isString(v) || v.length !== (44 + addressPrefix.length)) return false;

    const prefix = publicKey.slice(0, addressPrefix.length);

    if(addressPrefix !== prefix) return false;

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

    if (chainValidation.is_empty(v)) {
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


