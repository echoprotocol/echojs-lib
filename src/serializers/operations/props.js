import { transferOperationPropsSerializer } from '../protocol/transfer';
import { accountCreateOperationPropsSerializer } from '../protocol/account';

export const transfer = transferOperationPropsSerializer;
export const accountCreate = accountCreateOperationPropsSerializer;
