import { asset, extensions } from '../chain';
import { accountId, committeeMemberId } from '../chain/id/protocol';
import { StructSerializer } from '../collections';

export const committeeFrozenBalanceDepositOperationPropsSerializer: StructSerializer<{
    fee: typeof asset,
    committee_member: typeof committeeMemberId,
    committee_member_account: typeof accountId,
    amount: typeof asset,
	extensions: typeof extensions,
}>;

export const committeeFrozenBalanceWithdrawOperationPropsSerializer: StructSerializer<{
    fee: typeof asset,
    committee_member_account: typeof accountId,
    amount: typeof asset,
	extensions: typeof extensions,
}>;
