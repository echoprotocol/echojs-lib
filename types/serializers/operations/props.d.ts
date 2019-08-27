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
	assetUpdateBitassetPropsSerializer,
	assetUpdateFeedProducersOperationPropsSerializer,
} from "../protocol/asset";

export declare const transfer: typeof transferOperationPropsSerializer;
export declare const accountCreate: typeof accountCreateOperationPropsSerializer;
export declare const accountUpdate: typeof accountUpdateOperationPropsSerializer;
export declare const accountWhitelist: typeof accountWhitelistOperationPropsSerializer;
export declare const accountTransfer: typeof accountTransferOperationPropsSerializer;
export declare const assetCreate: typeof assetCreateOperationPropsSerializer;
export declare const assetUpdate: typeof assetUpdateOperationPropsSerializer;
export declare const assetUpdateBitasset: typeof assetUpdateBitassetPropsSerializer;
export declare const assetUpdateFeedProducers: typeof assetUpdateFeedProducersOperationPropsSerializer;
