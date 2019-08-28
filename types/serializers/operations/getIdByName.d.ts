import * as props from "./props";
import { OPERATIONS_IDS } from "../../constants";

export type OperationIdByName<T extends keyof typeof props> = {
	transfer: OPERATIONS_IDS.TRANSFER,
	accountCreate: OPERATIONS_IDS.ACCOUNT_CREATE;
	accountUpdate: OPERATIONS_IDS.ACCOUNT_UPDATE;
	accountWhitelist: OPERATIONS_IDS.ACCOUNT_WHITELIST;
	accountTransfer: OPERATIONS_IDS.ACCOUNT_TRANSFER;
	assetCreate: OPERATIONS_IDS.ASSET_CREATE;
	assetUpdate: OPERATIONS_IDS.ASSET_UPDATE;
	assetUpdateBitasset: OPERATIONS_IDS.ASSET_UPDATE_BITASSET;
	assetUpdateFeedProducers: OPERATIONS_IDS.ASSET_UPDATE_FEED_PRODUCERS;
	assetIssue: OPERATIONS_IDS.ASSET_ISSUE;
	assetReserve: OPERATIONS_IDS.ASSET_RESERVE;
	assetFundFeePool: OPERATIONS_IDS.ASSET_FUND_FEE_POOL;
	assetPublishFeed: OPERATIONS_IDS.ASSET_PUBLISH_FEED;
	proposalCreate: OPERATIONS_IDS.PROPOSAL_CREATE;
	proposalUpdate: OPERATIONS_IDS.PROPOSAL_UPDATE;
	proposalDelete: OPERATIONS_IDS.PROPOSAL_DELETE;
	committeeMemberCreate: OPERATIONS_IDS.COMMITTEE_MEMBER_CREATE;
	committeeMemberUpdate: OPERATIONS_IDS.COMMITTEE_MEMBER_UPDATE;
	committeeMemberUpdateGlobalParameters: OPERATIONS_IDS.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS,
}[T];

export type OperationWithName<T extends keyof typeof props> = OperationIdByName<T>;

export default function getOperationIdByName<T extends keyof typeof props>(name: T): OperationWithName<T>;
