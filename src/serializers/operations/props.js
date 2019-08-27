import { transferOperationPropsSerializer } from '../protocol/transfer';
import {
	accountCreateOperationPropsSerializer,
	accountUpdateOperationPropsSerializer,
	accountWhitelistOperationPropsSerializer,
	accountTransferOperationPropsSerializer,
} from '../protocol/account';

export const transfer = transferOperationPropsSerializer;
export const accountCreate = accountCreateOperationPropsSerializer;
export const accountUpdate = accountUpdateOperationPropsSerializer;
export const accountWhitelist = accountWhitelistOperationPropsSerializer;
export const accountTransfer = accountTransferOperationPropsSerializer;
