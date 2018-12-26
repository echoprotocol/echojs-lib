/* eslint-disable max-len */
import Type from './type';
import {
	isUInt64, isUInt32, isUInt16, isUInt8, isInt64, isString, isHex, isBoolean, isArray, isVoid, isBytes,
	isAccountId, isAssetId, isForceSettlementId, isCommitteeMemberId, isWitnessId, isLimitOrderId, isCallOrderId, isCustomId,
	isProposalId, isOperationHistoryId, isWithdrawPermissionId, isVestingBalanceId, isWorkerId, isBalanceId, isContractId, isVoteId,
	isObjectId, isPublicKey,
	isObject,
} from '../utils/validator';

export const uint64 = new Type(isUInt64);
export const uint32 = new Type(isUInt32);
export const uint16 = new Type(isUInt16);
export const uint8 = new Type(isUInt8);
export const int64 = new Type(isInt64);
export const string = new Type(isString);
export const hex = new Type(isHex);
export const bool = new Type(isBoolean);
export const objectId = new Type(isObjectId);

export const object = new Type(isObject);
export const publicKey = new Type(isPublicKey);

export const array = new Type((type) => new Type((v) => isArray(v) && v.every((e) => type.validation(e))));
export const set = new Type((type) => new Type((v) => isArray(v) && v.every((e) => type.validation(e) && new Set(v).size === v.length)));
export const map = new Type((keyType, valueType) => new Type((v) => {
	if (!isArray(v)) return false;
	const { length } = v;

	const setObj = {};

	for (let i = 0; i < length; i += 1) {
		if (!isArray(v[i]) || v[i].length !== 2) return false;
		const [key, value] = v[i];
		if (!keyType.validate(key) || !valueType.validate(value)) return false;
		if (setObj[key]) return false;
		setObj[key] = value;
	}

	return true;
}));

export const bytes = (length) => new Type((v) => isBytes(v, length));
export const operation = (operations) => new Type((v) => operations.some((op) => op.verify(v)));
export const asset = new Type((v) => isObject(v) && isInt64(v.amount) && isAssetId((v.asset_id)));
export const memoData = new Type((v) => isObject(v) && isPublicKey(v.from) && isPublicKey(v.to) && isUInt64(v.nonce) && isHex(v.memo));

export const custom = new Type((types) => new Type((v) => types.some((type) => type.validate(v))));
export const optional = new Type((type) => new Type((v) => isVoid(v) || type.validate(v)));

export const protocolIdType = new Type((idType) => {
	switch (idType) {
		case 'account':
			return new Type(isAccountId);
		case 'asset':
			return new Type(isAssetId);
		case 'force_settlement':
			return new Type(isForceSettlementId);
		case 'committee_member':
			return new Type(isCommitteeMemberId);
		case 'witness':
			return new Type(isWitnessId);
		case 'limit_order':
			return new Type(isLimitOrderId);
		case 'call_order':
			return new Type(isCallOrderId);
		case 'custom':
			return new Type(isCustomId);
		case 'operation_history':
			return new Type(isOperationHistoryId);
		case 'withdraw_permission':
			return new Type(isWithdrawPermissionId);
		case 'vesting_balance':
			return new Type(isVestingBalanceId);
		case 'worker':
			return new Type(isWorkerId);
		case 'balance':
			return new Type(isBalanceId);
		case 'proposal':
			return new Type(isProposalId);
		case 'contract':
			return new Type(isContractId);
		case 'vote':
			return new Type(isVoteId);
		default:
			return new Type(() => false);
	}
});

export const authority = new Type((v) =>
	isObject(v) &&
    isUInt32(v.weight_threshold) &&
    map(protocolIdType('account'), uint16).validate(v.account_auths) &&
    map(publicKey, uint16).validate(v.key_auths) &&
    map(publicKey, uint16).validate(v.address_auths));

export const accountOptions = new Type((v) =>
	isObject(v) &&
	isPublicKey(v.memo_key) &&
    protocolIdType('account').validate(v.voting_account) &&
	isUInt16(v.num_witness) &&
	isUInt16(v.num_committee) &&
    protocolIdType('vote').validate(v.votes) &&
    optional(object).validate(v.extensions));

export const price = new Type((v) =>
	isObject(v) &&
	asset.validate(v.base) &&
	asset.validate(v.quote));

export const assetOptions = new Type((v) =>
	isObject(v) &&
    isInt64(v.max_supply) &&
    isUInt16(v.market_fee_percent) &&
    isUInt64(v.max_market_fee) &&
    isUInt16(v.issuer_permissions) &&
    isUInt16(v.flags) &&
	price.validate(v.core_exchange_rate) &&
    set(protocolIdType('account')).validate(v.whitelist_authorities) &&
    set(protocolIdType('account')).validate(v.blacklist_authorities) &&
    set(protocolIdType('asset')).validate(v.whitelist_markets) &&
    set(protocolIdType('asset')).validate(v.blacklist_markets) &&
	isString(v.description) &&
    optional(object).validate(v.extension));

Operations.bitassetOptions = new Operation(
    'bitasset_options',
    {
        feed_lifetime_sec: uint32,
        minimum_feeds: uint8,
        force_settlement_delay_sec: uint32,
        force_settlement_offset_percent: uint16,
        maximum_force_settlement_volume: uint16,
        short_backing_asset: protocolIdType('asset'),
        extensions: optional(object),
    },
);