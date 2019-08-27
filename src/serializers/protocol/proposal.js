/* eslint-disable import/prefer-default-export */
import { timePointSec } from '../basic';
import { uint32 } from '../basic/integers';
import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { struct, vector, optional } from '../collections';
import { operation } from '../operations';

export const proposalCreateOperationPropsSerializer = struct({
	fee: asset,
	fee_paying_account: accountId,
	proposed_ops: vector(operation),
	expiration_time: timePointSec,
	review_period_seconds: optional(uint32),
	extensions,
});
