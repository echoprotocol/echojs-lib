/* eslint-disable import/prefer-default-export */
import { timePointSec, bool } from '../basic';
import { uint32 } from '../basic/integers';
import { asset, extensions, publicKey } from '../chain';
import { accountId, proposalId } from '../chain/id/protocol';
import { struct, vector, optional, set } from '../collections';
import { operation } from '../operations';

export const proposalCreateOperationPropsSerializer = struct({
	fee: asset,
	fee_paying_account: accountId,
	proposed_ops: vector(operation),
	expiration_time: timePointSec,
	review_period_seconds: optional(uint32),
	extensions,
});

export const proposalUpdateOperationPropsSerializer = struct({
	fee_paying_account: accountId,
	fee: asset,
	proposal: proposalId,
	active_approvals_to_add: set(accountId),
	active_approvals_to_remove: set(accountId),
	owner_approvals_to_remove: set(accountId),
	key_approvals_to_add: set(publicKey),
	key_approvals_to_remove: set(publicKey),
	extensions,
});

export const proposalDeleteOperationPropsSerializer = struct({
	fee_paying_account: accountId,
	using_owner_authority: bool,
	fee: asset,
	proposal: proposalId,
	extensions,
});
