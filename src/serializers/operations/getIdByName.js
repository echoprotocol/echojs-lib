import * as props from './props';

/** @typedef {import("../../constants/operations-ids")} OPERATIONS_IDS */

/**
 * @typedef {Object} OperationIdByPropName
 * @property {OPERATIONS_IDS['TRANSFER']} transfer
 * @property {OPERATIONS_IDS['ACCOUNT_CREATE']} accountCreate
 * @property {OPERATIONS_IDS['ACCOUNT_UPDATE']} accountUpdate
 * @property {OPERATIONS_IDS['ACCOUNT_WHITELIST']} accountWhitelist
 * @property {OPERATIONS_IDS['ACCOUNT_TRANSFER']} accountTransfer
 * @property {OPERATIONS_IDS['ASSET_CREATE']} assetCreate
 * @property {OPERATIONS_IDS['ASSET_UPDATE']} assetUpdate
 * @property {OPERATIONS_IDS['ASSET_UPDATE_BITASSET']} assetUpdateBitasset
 * @property {OPERATIONS_IDS['ASSET_UPDATE_FEED_PRODUCERS']} assetUpdateFeedProducers
 * @property {OPERATIONS_IDS['ASSET_ISSUE']} assetIssue
 * @property {OPERATIONS_IDS['ASSET_RESERVE']} assetReserve
 * @property {OPERATIONS_IDS['ASSET_FUND_FEE_POOL']} assetFundFeePool
 * @property {OPERATIONS_IDS['ASSET_PUBLISH_FEED']} assetPublishFeed
 * @property {OPERATIONS_IDS['PROPOSAL_CREATE']} proposalCreate
 * @property {OPERATIONS_IDS['PROPOSAL_UPDATE']} proposalUpdate
 * @property {OPERATIONS_IDS['PROPOSAL_DELETE']} proposalDelete
 * @property {OPERATIONS_IDS['COMMITTEE_MEMBER_CREATE']} committeeMemberCreate
 * @property {OPERATIONS_IDS['COMMITTEE_MEMBER_UPDATE']} committeeMemberUpdate
 */

/**
 * @template {keyof typeof props} T
 * @typedef {OperationIdByPropName[T]} OperationWithPropName
 */

/**
 * @template {keyof typeof props} T
 * @param {T} opName
 * @returns {OperationWithPropName<T>}
 */
export default function getOperationIdByName(opName) {
	const serializer = props[opName];
	if (!serializer) throw new Error(`unknown operation name ${opName}`);
}
