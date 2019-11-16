import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { struct } from '../collections';

export const committeeFrozenBalanceDepositOperationPropSerializer = struct({
	fee: asset,
	committee_member_account: accountId,
	amount: asset,
	extensions,
});

export const committeeFrozenBalanceWithdrawOperationPropSerializer = struct({
	fee: asset,
	committee_member_account: accountId,
	amount: asset,
	extensions,
});
