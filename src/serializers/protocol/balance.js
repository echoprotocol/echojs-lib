import { asset, publicKey, extensions } from '../chain';
import { accountId, balanceId } from '../chain/id/protocol';
import { struct } from '../collections';
import { uint16 } from '../basic/integers';

// eslint-disable-next-line import/prefer-default-export
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
