import { string as stringSerializer } from './basic';
import { struct, vector } from './collections';

// eslint-disable-next-line
export const approvalDelta = struct({
	active_approvals_to_add: vector(stringSerializer),
	active_approvals_to_remove: vector(stringSerializer),
	owner_approvals_to_add: vector(stringSerializer),
	owner_approvals_to_remove: vector(stringSerializer),
	key_approvals_to_add: vector(stringSerializer),
	key_approvals_to_remove: vector(stringSerializer),
});
