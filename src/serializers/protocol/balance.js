import { asset, publicKey, extensions } from '../chain';
import { accountId, balanceId, frozenBalanceId } from '../chain/id/protocol';
import { struct, vector } from '../collections';
import { uint16 } from '../basic/integers';

export const balanceClaimOperationPropsSerializer = struct({
	fee: asset,
	deposit_to_account: accountId,
	balance_to_claim: balanceId,
	balance_owner_key: publicKey,
	total_claimed: asset,
	extensions,
});

export const balanceFreezeOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	amount: asset,
	duration: uint16,
	extensions,
});

export const balanceUnfreezeOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	amount: asset,
	extensions,
});

export const requestBalanceUnfreezeOperation = struct({
	fee: asset,
	account: accountId,
	objects_to_unfreeze: vector(frozenBalanceId),
	extensions,
});
