/* eslint-disable import/prefer-default-export */
import { struct } from '../collections';
import { asset, extensions } from '../chain';
import { accountId } from '../chain/id';

export const transfer = struct({
	fee: asset,
	from: accountId,
	to: accountId,
	amount: asset,
	extensions,
});
