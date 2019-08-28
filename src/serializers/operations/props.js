import { transferOperationPropsSerializer } from '../protocol/transfer';

import {
	accountCreateOperationPropsSerializer,
	accountUpdateOperationPropsSerializer,
	accountWhitelistOperationPropsSerializer,
	accountTransferOperationPropsSerializer,
} from '../protocol/account';

import {
	assetCreateOperationPropsSerializer,
	assetUpdateOperationPropsSerializer,
	assetUpdateBitassetOperationPropsSerializer,
	assetUpdateFeedProducersOperationPropsSerializer,
	assetIssueOperationPropsSerializer,
	assetReserveOperationPropsSerializer,
	assetFundFeePoolOperationPropsSerializer,
	assetPublishFeedOperationPropsSerializer,
} from '../protocol/asset';

import {
	proposalCreateOperationPropsSerializer,
	proposalUpdateOperationPropsSerializer,
	proposalDeleteOperationPropsSerializer,
} from '../protocol/proposal';

import { committeeMemberCreateOperationPropsSerializer, committeeMemberUpdateOperationPropsSerializer } from '../protocol/committee_member';

export const transfer = transferOperationPropsSerializer;
export const accountCreate = accountCreateOperationPropsSerializer;
export const accountUpdate = accountUpdateOperationPropsSerializer;
export const accountWhitelist = accountWhitelistOperationPropsSerializer;
export const accountTransfer = accountTransferOperationPropsSerializer;
export const assetCreate = assetCreateOperationPropsSerializer;
export const assetUpdate = assetUpdateOperationPropsSerializer;
export const assetUpdateBitasset = assetUpdateBitassetOperationPropsSerializer;
export const assetUpdateFeedProducers = assetUpdateFeedProducersOperationPropsSerializer;
export const assetIssue = assetIssueOperationPropsSerializer;
export const assetReserve = assetReserveOperationPropsSerializer;
export const assetFundFeePool = assetFundFeePoolOperationPropsSerializer;
export const assetPublishFeed = assetPublishFeedOperationPropsSerializer;
export const proposalCreate = proposalCreateOperationPropsSerializer;
export const proposalUpdate = proposalUpdateOperationPropsSerializer;
export const proposalDelete = proposalDeleteOperationPropsSerializer;
export const committeeMemberCreate = committeeMemberCreateOperationPropsSerializer;
export const committeeMemberUpdate = committeeMemberUpdateOperationPropsSerializer;
