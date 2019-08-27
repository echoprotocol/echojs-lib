import { transferOperationPropsSerializer } from '../protocol/transfer';
import { accountCreateOperationPropsSerializer, accountUpdateOperationPropsSerializer } from '../protocol/account';

export const transfer = transferOperationPropsSerializer;
export const accountCreate = accountCreateOperationPropsSerializer;
export const accountUpdate = accountUpdateOperationPropsSerializer;
