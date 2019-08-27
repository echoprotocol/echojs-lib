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
} from '../protocol/asset';

export const transfer = transferOperationPropsSerializer;
export const accountCreate = accountCreateOperationPropsSerializer;
export const accountUpdate = accountUpdateOperationPropsSerializer;
export const accountWhitelist = accountWhitelistOperationPropsSerializer;
export const accountTransfer = accountTransferOperationPropsSerializer;
export const assetCreate = assetCreateOperationPropsSerializer;
export const assetUpdate = assetUpdateOperationPropsSerializer;
export const assetUpdateBitasset = assetUpdateBitassetOperationPropsSerializer;
export const assetUpdateFeedProducers = assetUpdateFeedProducersOperationPropsSerializer;
