import { string } from '../basic';
import { accountId } from '../chain/id/protocol';
import { anyObjectId } from '../chain/id';
import { asset } from '../chain';

import { struct, set } from '../collections';

export const didCreateOperationSerializer = struct({
	fee: asset,
	registrar: accountId,
	essence: anyObjectId,
	public_keys: set(string),
});

export const didUpdateOperationSerializer = struct({
	fee: asset,
	registrar: accountId,
	did_identifier: string,
	pub_keys_to_delete: set(string),
	pub_keys_to_add: set(string),
});

export const didDeleteOperationSerializer = struct({
	fee: asset,
	registrar: accountId,
	did_identifier: string,
});
