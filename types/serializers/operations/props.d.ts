import { transferOperationPropsSerializer } from "../protocol/transfer";

import {
	accountCreateOperationPropsSerializer,
	accountUpdateOperationPropsSerializer,
	accountWhitelistOperationPropsSerializer,
	accountTransferOperationPropsSerializer,
} from "../protocol/account";

import {
	assetCreateOperationPropsSerializer,
	assetUpdateOperationPropsSerializer,
	assetUpdateBitassetOperationPropsSerializer,
	assetUpdateFeedProducersOperationPropsSerializer,
	assetIssueOperationPropsSerializer,
	assetReserveOperationPropsSerializer,
	assetFundFeePoolOperationPropsSerializer,
	assetPublishFeedOperationPropsSerializer,
} from "../protocol/asset";

import { proposalCreateOperationPropsSerializer, proposalUpdateOperationPropsSerializer } from "../protocol/proposal";

export declare const transfer: typeof transferOperationPropsSerializer;
export declare const accountCreate: typeof accountCreateOperationPropsSerializer;
export declare const accountUpdate: typeof accountUpdateOperationPropsSerializer;
export declare const accountWhitelist: typeof accountWhitelistOperationPropsSerializer;
export declare const accountTransfer: typeof accountTransferOperationPropsSerializer;
export declare const assetCreate: typeof assetCreateOperationPropsSerializer;
export declare const assetUpdate: typeof assetUpdateOperationPropsSerializer;
export declare const assetUpdateBitasset: typeof assetUpdateBitassetOperationPropsSerializer;
export declare const assetUpdateFeedProducers: typeof assetUpdateFeedProducersOperationPropsSerializer;
export declare const assetIssue: typeof assetIssueOperationPropsSerializer;
export declare const assetReserve: typeof assetReserveOperationPropsSerializer;
export declare const assetFundFeePool: typeof assetFundFeePoolOperationPropsSerializer;
export declare const assetPublishFeed: typeof assetPublishFeedOperationPropsSerializer;
export declare const proposalCreate: typeof proposalCreateOperationPropsSerializer;
export declare const proposalUpdate: typeof proposalUpdateOperationPropsSerializer;
