import { accountId } from '../chain/id/protocol';
import { anyObjectId } from '../chain/id';
import { asset, publicKey } from '../chain';
import { string as stringSerializer } from '../basic';

import { struct, set } from '../collections';

export const didCreateOperationSerializer = struct({
	fee: asset,
	registrar: accountId,
	essence: anyObjectId,
	public_keys: set(publicKey),
});

export const didUpdateOperationSerializer = struct({
	fee: asset,
	registrar: accountId,
	did_identifier: stringSerializer,
	pub_keys_to_delete: set(stringSerializer),
	pub_keys_to_add: set(stringSerializer),
});

export const didDeleteOperationSerializer = struct({
	fee: asset,
	registrar: accountId,
	did_identifier: stringSerializer,
});
