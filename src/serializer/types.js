/* eslint-disable max-len */
import Type from './type';
import {
	isUInt64,
	isUInt32,
	isUInt16,
	isUInt8,
	isInt64,
	isString,
	isHex,
	isBoolean,
	isArray,
	isAccountId,
	isPublicKey,
	isAssetId,
	isBalanceId,
	isContractId,
	isVoteId,
	isWitnessId,
	isProposalId,
	isObject,
	isObjectId,
	isVoid,
	isBytes,
} from '../utils/validator';

export const uint64 = new Type(isUInt64);
export const uint32 = new Type(isUInt32);
export const uint16 = new Type(isUInt16);
export const uint8 = new Type(isUInt8);
export const int64 = new Type(isInt64);
export const string = new Type(isString);
export const hex = new Type(isHex);
export const bool = new Type(isBoolean);
export const accountId = new Type(isAccountId);
export const assetId = new Type(isAssetId);
export const balanceId = new Type(isBalanceId);
export const contractId = new Type(isContractId);
export const objectId = new Type(isObjectId);
export const voteId = new Type(isVoteId);
export const witnessId = new Type(isWitnessId);
export const proposalId = new Type(isProposalId);
export const empty = new Type(isVoid);
export const object = new Type(isObject);
export const publicPey = new Type(isPublicKey);
export const array = new Type((type) => new Type((v) => isArray(v) && v.every((e) => type.validation(e))));
export const bytes = new Type((length) => new Type((v) => isBytes(v, length)));
export const operation = new Type((operations) => new Type((v) => operations.some((op) => op.validate(v))));
export const asset = new Type((v) => isObject(v) && isInt64(v.amount) && isAssetId((v.asset_id)));
export const memoData = new Type((v) => isObject(v) && isPublicKey(v.from) && isPublicKey(v.to) && isUInt64(v.nonce) && isHex(v.memo));

export const custom = new Type((types) => new Type((v) => types.some((type) => type.validate(v))));
export const optional = new Type((type) => new Type((v) => isVoid(v) || type.validate(v)));

