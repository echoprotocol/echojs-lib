/* eslint-disable max-len */
import Type from './type';
import {
	isUInt64, isUInt32, isUInt16, isUInt8, isInt64, isString, isHex, isBoolean, isArray, isVoid, isBytes,
	isAccountId, isAssetId, isForceSettlementId, isCommitteeMemberId, isWitnessId, isLimitOrderId, isCallOrderId, isCustomId,
	isProposalId, isOperationHistoryId, isWithdrawPermissionId, isVestingBalanceId, isWorkerId, isBalanceId, isContractId, isVoteId,
	isObjectId, isPublicKey,
	isObject, isEmptyObject, isEmptyArray,
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

export const array = (type) => new Type((v) => isArray(v) && v.every((e) => type.validation(e)));
export const set = (type) => new Type((v) => isArray(v) && v.every((e) => type.validation(e) && new Set(v).size === v.length));
const map = (keyType, valueType) => new Type((v) => {
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
});

export const bytes = (length) => new Type((v) => isBytes(v, length));
export const operation = (operations) => new Type((v) => operations.some((op) => op.verify(v)));
export const asset = new Type((v) => isObject(v) && isInt64(v.amount) && isAssetId((v.asset_id)));
export const memoData = new Type((v) => isObject(v) && isPublicKey(v.from) && isPublicKey(v.to) && isUInt64(v.nonce) && isHex(v.memo));

export const custom = (types) => new Type((v) => types.some((type) => type.validate(v)));
export const optional = (type) => new Type((v) => isVoid(v) || type.validate(v));

export const emptyArray = new Type(isEmptyArray);

export const protocolIdType = (idType) => {
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
    protocolIdType('account').validate(v.voting_account) &&
	isUInt16(v.num_witness) &&
	isUInt16(v.num_committee) &&
    protocolIdType('vote').validate(v.votes) &&
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
    protocolIdType('account').validate(v[1].account_id) &&
    isString(v[1].name));

const assetSymbolEqLitPredicate = new Type((v) =>
	isArray(v) &&
    v[0] === 1 &&
    isObject(v[1]) &&
    protocolIdType('asset').validate(v[1].asset_id) &&
    isString(v[1].symbol));

const blockIdPredicate = new Type((v) =>
	isArray(v) &&
    v[0] === 2 &&
    isObject(v[1]) &&
    isBytes(v[1].id, 20));

const transfer_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee) &&
    isUInt32(v.price_per_kbyte));

const limit_order_create_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const limit_order_cancel_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const call_order_update_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const fill_order_operation_fee_parameters = new Type((v) => 'fill_order_operation_fee_parameters');

const account_create_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee) &&
    isUInt32(v.price_per_kbyte));

const account_update_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee) &&
    isUInt32(v.price_per_kbyte));

const account_whitelist_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const account_upgrade_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.membership_annual_fee) &&
    isUInt64(v.membership_lifetime_fee));

const account_transfer_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const asset_create_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.symbol3) &&
    isUInt64(v.symbol4) &&
    isUInt64(v.long_symbol) &&
    isUInt32(v.price_per_kbyte));

const asset_update_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee) &&
    isUInt32(v.price_per_kbyte));

const asset_update_bitasset_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const asset_update_feed_producers_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const asset_issue_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee) &&
    isUInt32(v.price_per_kbyte));

const asset_reserve_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const asset_fund_fee_pool_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const asset_settle_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const asset_global_settle_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const asset_publish_feed_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const witness_create_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const witness_update_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const proposal_create_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee) &&
    isUInt32(v.price_per_kbyte));

const proposal_update_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee) &&
    isUInt32(v.price_per_kbyte));

const proposal_delete_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const withdraw_permission_create_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const withdraw_permission_update_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const withdraw_permission_claim_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee) &&
    isUInt32(v.price_per_kbyte));

const withdraw_permission_delete_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const committee_member_create_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const committee_member_update_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const committee_member_update_global_parameters_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const vesting_balance_create_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const vesting_balance_withdraw_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const worker_create_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const custom_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee) &&
    isUInt32(v.price_per_kbyte));

const assert_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee));

const balance_claim_operation_fee_parameters = new Type((v) => 'balance_claim_operation_fee_parameters');

const override_transfer_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee) &&
    isUInt32(v.price_per_kbyte));

const transfer_to_blind_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
    isUInt64(v.fee) &&
    isUInt32(v.price_per_output));

const blind_transfer_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
	isUInt64(v.fee) &&
	isUInt32(v.price_per_output));

const transfer_from_blind_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
	isUInt64(v.fee));

const asset_settle_cancel_operation_fee_parameters = new Type((v) => 'asset_settle_cancel_operation_fee_parameters');

const asset_claim_fees_operation_fee_parameters = new Type((v) =>
	isObject(v) &&
	isUInt64(v.fee));


const feeParameters = custom([
	transfer_operation_fee_parameters,
	limit_order_create_operation_fee_parameters,
	limit_order_cancel_operation_fee_parameters,
	call_order_update_operation_fee_parameters,
	fill_order_operation_fee_parameters,
	account_create_operation_fee_parameters,
	account_update_operation_fee_parameters,
	account_whitelist_operation_fee_parameters,
	account_upgrade_operation_fee_parameters,
	account_transfer_operation_fee_parameters,
	asset_create_operation_fee_parameters,
	asset_update_operation_fee_parameters,
	asset_update_bitasset_operation_fee_parameters,
	asset_update_feed_producers_operation_fee_parameters,
	asset_issue_operation_fee_parameters,
	asset_reserve_operation_fee_parameters,
	asset_fund_fee_pool_operation_fee_parameters,
	asset_settle_operation_fee_parameters,
	asset_global_settle_operation_fee_parameters,
	asset_publish_feed_operation_fee_parameters,
	witness_create_operation_fee_parameters,
	witness_update_operation_fee_parameters,
	proposal_create_operation_fee_parameters,
	proposal_update_operation_fee_parameters,
	proposal_delete_operation_fee_parameters,
	withdraw_permission_create_operation_fee_parameters,
	withdraw_permission_update_operation_fee_parameters,
	withdraw_permission_claim_operation_fee_parameters,
	withdraw_permission_delete_operation_fee_parameters,
	committee_member_create_operation_fee_parameters,
	committee_member_update_operation_fee_parameters,
	committee_member_update_global_parameters_operation_fee_parameters,
	vesting_balance_create_operation_fee_parameters,
	vesting_balance_withdraw_operation_fee_parameters,
	worker_create_operation_fee_parameters,
	custom_operation_fee_parameters,
	assert_operation_fee_parameters,
	balance_claim_operation_fee_parameters,
	override_transfer_operation_fee_parameters,
	transfer_to_blind_operation_fee_parameters,
	blind_transfer_operation_fee_parameters,
	transfer_from_blind_operation_fee_parameters,
	asset_settle_cancel_operation_fee_parameters,
	asset_claim_fees_operation_fee_parameters,

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
	isEmptyArray(max_authority_depth));

