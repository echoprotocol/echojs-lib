import { asset, extensions, ripemd160 } from '../chain';
import { accountId } from '../chain/id/protocol';
import { struct } from '../collections';

export const transferOperationPropsSerializer = struct({
	fee: asset,
	from: accountId,
	to: accountId,
	amount: asset,
	extensions,
});

export const overrideTransferOperationPropsSerializer = struct({
	fee: asset,
	issuer: accountId,
	from: accountId,
	to: accountId,
	amount: asset,
	extensions,
});

export const transferToAddressOperationPropsSerializer = struct({
	fee: asset,
	from: accountId,
	to: ripemd160,
	amount: asset,
	extensions,
});
