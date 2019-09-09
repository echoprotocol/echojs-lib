import { asset, publicKey, extensions } from '../chain';
import { accountId, balanceId } from '../chain/id/protocol';
import { struct } from '../collections';

// eslint-disable-next-line import/prefer-default-export
export const balanceClaimOperationPropsSerializer = struct({
	fee: asset,
	deposit_to_account: accountId,
	balance_to_claim: balanceId,
	balance_owner_key: publicKey,
	total_claimed: asset,
	extensions,
});
