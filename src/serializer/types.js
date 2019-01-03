/* eslint-disable max-len */
import Type from './type';
import * as validator from '../utils/validator';
import ArrayType from './complex-types/array-type';
import SetType from './complex-types/set-type';
import MapType from './complex-types/map-type';

export const uint64 = new Type(validator.isUInt64);
export const uint32 = new Type(validator.isUInt32);
export const uint16 = new Type(validator.isUInt16);
export const uint8 = new Type(validator.isUInt8);
export const int64 = new Type(validator.isInt64);
export const string = new Type(validator.isString);
export const hex = new Type(validator.isHex);
export const bool = new Type(validator.isBoolean);
export const object = new Type(validator.isObject);
export const publicKey = new Type(validator.isPublicKey);
export const timePointSec = new Type(validator.isTimePointSec);

export const array = (type) => new ArrayType(type);
export const set = (type) => new SetType(type);

const map = (keyType, valueType) => new Type((v) => {
	if (!isArray(v)) return false;
	const { length } = v;

	const setObj = {};

	for (let i = 0; i < length; i += 1) {
		if (!isArray(v[i]) || v[i].length !== 2) return false;
		const [key, value] = v[i];
		if (!keyType.isValid(key) || !valueType.isValid(value)) return false;
		if (setObj[key]) return false;
		setObj[key] = value;
	}

	return true;
});

export const bytes = (length) => new Type((v) => isBytes(v, length));
export const operation = (operations) => new Type((v) => operations.some((op) => op.isValid(v)));
export const asset = new Type((v) => isObject(v) && isInt64(v.amount) && isAssetId((v.asset_id)));

export const unrequiredAsset = new Type((v) =>
	isVoid(v) || (isObject(v) && (isVoid(v.amount) || isInt64(v.amount)) && isAssetId(v.asset_id)));

export const memoData = new Type((v) => isObject(v) && isPublicKey(v.from) && isPublicKey(v.to) && isUInt64(v.nonce) && isHex(v.memo));

export const custom = (types) => new Type((v) => types.some((type) => type.isValid(v)));
export const optional = (type) => new Type((v) => isVoid(v) || type.isValid(v));

export const emptyArray = new Type(isEmptyArray);

export const protocolId = {
	account: new Type(validator.isAccountId),
	asset: new Type(validator.isAssetId),
	force_settlement: new Type(validator.isForceSettlementId),
	committee_member: new Type(validator.isCommitteeMemberId),
	witness: new Type(validator.isWitnessId),
	limit_order: new Type(validator.isLimitOrderId),
	call_order: new Type(validator.isCallOrderId),
	custom: new Type(validator.isCustomId),
	operation_history: new Type(validator.isOperationHistoryId),
	withdraw_permission: new Type(validator.isWithdrawPermissionId),
	vesting_balance: new Type(validator.isVestingBalanceId),
	worker: new Type(validator.isWorkerId),
	balance: new Type(validator.isBalanceId),
	proposal: new Type(validator.isProposalId),
	contract: new Type(validator.isContractId),
	vote: new Type(validator.isVoteId),
};

export const authority = new Type((v) =>
	isObject(v) &&
    isUInt32(v.weight_threshold) &&
    map(protocolIdType('account'), uint16).validate(v.account_auths) &&
    map(publicKey, uint16).validate(v.key_auths) &&
    map(publicKey, uint16).validate(v.address_auths));

export const accountOptions = new Type((v) =>
	isObject(v) &&
	isPublicKey(v.memo_key) &&
    protocolIdType('account').isValid(v.voting_account) &&
	isUInt16(v.num_witness) &&
	isUInt16(v.num_committee) &&
    protocolIdType('vote').isValid(v.votes) &&
    isEmptyArray(v.extensions));

export const price = new Type((v) =>
	isObject(v) &&
	asset.validate(v.base) &&
	asset.validate(v.quote));

export const priceFeed = new Type((v) =>
	isObject(v) &&
	price.validate(v.settlement_price) &&
	isUInt16(v.maintenance_collateral_ratio) &&
	isUInt16(v.maximum_short_squeeze_ratio) &&
	price.validate(v.core_exchange_rate));

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


const linearVestingPolicyInitializer = new Type((v) =>
	isArray(v) &&
    v[0] === 0 &&
    isObject(v[1]) &&
    isUInt64(v[1].begin_timestamp) && // time_point_sec
    isUInt32(v[1].vesting_cliff_seconds) &&
    isUInt32(v[1].vesting_duration_seconds));

const cddVestingPolicyInitializer = new Type((v) =>
	isArray(v) &&
    v[0] === 1 &&
    isObject(v[1]) &&
    isUInt64(v[1].start_claim) && // time_point_sec
    isUInt32(v[1].vesting_seconds));

const refundWorkerInitializer = new Type((v) => isArray(v) && v[0] === 0 && isEmptyObject(v[1]));

const vestingBalanceWorkerInitializer = new Type((v) =>
	isArray(v) &&
    v[0] === 1 &&
	isObject(v[1]) &&
	isUInt16(v[1].pay_vesting_period_days));

const burnWorkerInitializer = new Type((v) => isArray(v) && v[0] === 2 && isEmptyObject(v[1]));

const accountNameEqLitPredicate = new Type((v) =>
	isArray(v) &&
	v[0] === 0 &&
	isObject(v[1]) &&
    protocolIdType('account').isValid(v[1].account_id) &&
    isString(v[1].name));

const assetSymbolEqLitPredicate = new Type((v) =>
	isArray(v) &&
    v[0] === 1 &&
    isObject(v[1]) &&
    protocolIdType('asset').isValid(v[1].asset_id) &&
    isString(v[1].symbol));

const blockIdPredicate = new Type((v) =>
	isArray(v) &&
    v[0] === 2 &&
    isObject(v[1]) &&
    isBytes(v[1].id, 20));

const transferOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 0 &&
	isObject(v[1]) &&
    isUInt64(v[1].fee) &&
    isUInt32(v[1].price_per_kbyte));

const limitOrderCreateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
    v[0] === 1 &&
    isObject(v[1]) &&
    isUInt64(v[1].fee));

const limitOrderCancelOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 2 &&
	isObject(v[1]) &&
    isUInt64(v[1].fee));

const callOrderUpdateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 3 &&
	isObject(v[1]) &&
    isUInt64(v[1].fee));

const fillOrderOperationFeeParameters = new Type((v) =>
	isArray(v) &&
    v[0] === 4 &&
    isEmptyObject(v[1]));

const accountCreateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 5 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee) &&
	isUInt32(v[1].price_per_kbyte));

const accountUpdateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 6 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee) &&
	isUInt32(v[1].price_per_kbyte));

const accountWhitelistOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 7 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const accountUpgradeOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 8 &&
	isObject(v[1]) &&
	isUInt64(v[1].membership_annual_fee) &&
    isUInt64(v[1].membership_lifetime_fee));

const accountTransferOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 9 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const assetCreateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 10 &&
	isObject(v[1]) &&
	isUInt64(v[1].symbol3) &&
	isUInt64(v[1].symbol4) &&
	isUInt64(v[1].long_symbol) &&
	isUInt32(v[1].price_per_kbyte));

const assetUpdateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 11 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee) &&
	isUInt32(v[1].price_per_kbyte));

const assetUpdateBitassetOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 12 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const assetUpdateFeedProducersOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 13 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const assetIssueOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 14 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee) &&
	isUInt32(v[1].price_per_kbyte));

const assetReserveOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 15 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const assetFundFeePoolOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 16 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const assetSettleOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 17 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const assetGlobalSettleOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 18 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const assetPublishFeedOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 19 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const witnessCreateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 20 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const witnessUpdateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 21 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const proposalCreateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 22 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee) &&
	isUInt32(v[1].price_per_kbyte));

const proposalUpdateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 23 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee) &&
	isUInt32(v[1].price_per_kbyte));

const proposalDeleteOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 24 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const withdrawPermissionCreateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 25 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const withdrawPermissionUpdateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 26 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const withdrawPermissionClaimOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 27 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee) &&
	isUInt32(v[1].price_per_kbyte));

const withdrawPermissionDeleteOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 28 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const committeeMemberCreateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 29 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const committeeMemberUpdateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 30 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const committeeMemberUpdateGlobalParametersOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 31 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const vestingBalanceCreateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 32 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const vestingBalanceWithdrawOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 33 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const workerCreateOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 34 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const customOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 35 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee) &&
	isUInt32(v[1].price_per_kbyte));

const assertOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 36 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const balanceClaimOperationFeeParameters = new Type((v) =>
	isArray(v) &&
    v[0] === 37 &&
    isEmptyObject(v[1]));

const overrideTransferOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 38 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee) &&
	isUInt32(v[1].price_per_kbyte));

const transferToBlindOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 39 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee) &&
	isUInt32(v[1].price_per_kbyte));

const blindTransferOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 40 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee) &&
	isUInt32(v[1].price_per_kbyte));

const transferFromBlindOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 41 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const assetsettleCancelOperationFeeParameters = new Type((v) =>
	isArray(v) &&
    v[0] === 42 &&
    isEmptyObject(v[1]));

const assetclaimFeesOperationFeeParameters = new Type((v) =>
	isArray(v) &&
	v[0] === 43 &&
	isObject(v[1]) &&
	isUInt64(v[1].fee));

const echorandConfig = new Type((v) =>
	isObject(v) &&
    isUInt64(v._time_net_1mb) &&
    isUInt64(v._time_net_256b) &&
    isUInt64(v._creator_count) &&
    isUInt64(v._verifier_count) &&
    isUInt64(v._ok_threshold) &&
    isUInt64(v._max_bba_steps) &&
    isUInt64(v._gc1_delay));

const feeParameters = custom([
	transferOperationFeeParameters,
	limitOrderCreateOperationFeeParameters,
	limitOrderCancelOperationFeeParameters,
	callOrderUpdateOperationFeeParameters,
	fillOrderOperationFeeParameters,
	accountCreateOperationFeeParameters,
	accountUpdateOperationFeeParameters,
	accountWhitelistOperationFeeParameters,
	accountUpgradeOperationFeeParameters,
	accountTransferOperationFeeParameters,
	assetCreateOperationFeeParameters,
	assetUpdateOperationFeeParameters,
	assetUpdateBitassetOperationFeeParameters,
	assetUpdateFeedProducersOperationFeeParameters,
	assetIssueOperationFeeParameters,
	assetReserveOperationFeeParameters,
	assetFundFeePoolOperationFeeParameters,
	assetSettleOperationFeeParameters,
	assetGlobalSettleOperationFeeParameters,
	assetPublishFeedOperationFeeParameters,
	witnessCreateOperationFeeParameters,
	witnessUpdateOperationFeeParameters,
	proposalCreateOperationFeeParameters,
	proposalUpdateOperationFeeParameters,
	proposalDeleteOperationFeeParameters,
	withdrawPermissionCreateOperationFeeParameters,
	withdrawPermissionUpdateOperationFeeParameters,
	withdrawPermissionClaimOperationFeeParameters,
	withdrawPermissionDeleteOperationFeeParameters,
	committeeMemberCreateOperationFeeParameters,
	committeeMemberUpdateOperationFeeParameters,
	committeeMemberUpdateGlobalParametersOperationFeeParameters,
	vestingBalanceCreateOperationFeeParameters,
	vestingBalanceWithdrawOperationFeeParameters,
	workerCreateOperationFeeParameters,
	customOperationFeeParameters,
	assertOperationFeeParameters,
	balanceClaimOperationFeeParameters,
	overrideTransferOperationFeeParameters,
	transferToBlindOperationFeeParameters,
	blindTransferOperationFeeParameters,
	transferFromBlindOperationFeeParameters,
	assetsettleCancelOperationFeeParameters,
	assetclaimFeesOperationFeeParameters,
]);

const feeSchedule = new Type((v) =>
	isObject(v) &&
	set(feeParameters).validate(v.parameters) &&
	isUInt32(v.scale));


export const bitassetOptions = new Type((v) =>
	isObject(v) &&
    isUInt32(v.feed_lifetime_sec) &&
    isUInt8(v.minimum_feeds) &&
    isUInt32(v.force_settlement_delay_sec) &&
    isUInt16(v.maximum_force_settlement_volume) &&
    set(protocolIdType('asset')).validate(v.short_backing_asset) &&
    optional(object).validate(v.extension));

export const stealthConfirmation = new Type((v) =>
	isObject(v) &&
    isPublicKey(v.one_time_key) &&
    optional(publicKey).validate(v.to) &&
	isHex(v.encrypted_memo));

export const blindInput = new Type((v) =>
	isObject(v) &&
    isBytes(v.commitment, 33) &&
    authority.validate(v.owner));

export const blindOutput = new Type((v) =>
	isObject(v) &&
    isHex(v.range_proof) &&
    authority.validate(v.owner) &&
    optional(stealthConfirmation).validate(v.stealth_memo));

export const vestingPolicyInitializer = new Type((v) => custom([linearVestingPolicyInitializer, cddVestingPolicyInitializer]).validate(v));
export const workerInitializer = new Type((v) => custom([refundWorkerInitializer, vestingBalanceWorkerInitializer, burnWorkerInitializer]).validate(v));
export const predicate = new Type((v) => custom([accountNameEqLitPredicate, assetSymbolEqLitPredicate, blockIdPredicate]).validate(v));

export const chainParameters = new Type((v) =>
	isObject(v) &&
    feeSchedule.validate(v.current_fees) &&
	isUInt8(v.block_interval) &&
	isUInt32(v.maintenance_interval) &&
	isUInt8(v.maintenance_skip_slots) &&
    isUInt32(v.committee_proposal_review_period) &&
    isUInt32(v.maximum_transaction_size) &&
    isUInt32(v.maximum_block_size) &&
    isUInt32(v.maximum_time_until_expiration) &&
    isUInt32(v.maximum_proposal_lifetime) &&
    isUInt8(v.maximum_asset_whitelist_authorities) &&
    isUInt8(v.maximum_asset_feed_publishers) &&
    isUInt16(v.maximum_witness_count) &&
    isUInt16(v.maximum_committee_count) &&
    isUInt16(v.maximum_authority_membership) &&
    isUInt16(v.reserve_percent_of_fee) &&
    isUInt16(v.network_percent_of_fee) &&
    isUInt16(v.lifetime_referrer_percent_of_fee) &&
    isUInt32(v.cashback_vesting_period_seconds) &&
    isInt64(v.cashback_vesting_threshold) &&
    isBoolean(v.count_non_member_votes) &&
    isBoolean(v.allow_non_member_whitelists) &&
    isInt64(v.witness_pay_per_block) &&
    isInt64(v.worker_budget_per_day) &&
    isUInt16(v.max_predicate_opcode) &&
    isInt64(v.fee_liquidation_threshold) &&
    isUInt16(v.accounts_per_fee_scale) &&
    isUInt8(v.account_fee_scale_bitshifts) &&
    isUInt8(v.max_authority_depth) &&
    echorandConfig.validate(v.echorand_config) &&
	isEmptyArray(v.extensions));

