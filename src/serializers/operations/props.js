import { asset, extensions, publicKey } from '../chain';
import { accountId, balanceId } from '../chain/id/protocol';
import { struct } from '../collections';
import { string } from '../basic';

export const transfer = struct({
	fee: asset,
	from: accountId,
	to: accountId,
	amount: asset,
	extensions,
});

export const accountCreate = struct({
	fee: asset,
	registrar: accountId,
	name: string,
	active: 
});

export const balanceClaim = struct({
	fee: asset,
	deposit_to_account: accountId,
	balance_to_claim: balanceId,
	balance_owner_key: publicKey,
	total_claimed: asset,
	extensions,
});
