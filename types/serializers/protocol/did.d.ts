import { StringSerializer } from '../basic';
import { asset, publicKey } from '../chain';
import { anyObjectId } from '../chain/id';
import { accountId } from '../chain/id/protocol';
import { StructSerializer, SetSerializer } from '../collections';

export declare const didCreateOperationSerializer: StructSerializer<{
	fee: typeof asset,
	registrar: typeof accountId,
    essence: typeof anyObjectId,
    public_keys: SetSerializer<typeof publicKey>,
}>;

export declare const didUpdateOperationSerializer: StructSerializer<{
	fee: typeof asset,
	registrar: typeof accountId,
    did_identifier: StringSerializer,
    pub_keys_to_delete: SetSerializer<StringSerializer>,
	pub_keys_to_add: SetSerializer<StringSerializer>,
}>;

export declare const didDeleteOperationSerializer: StructSerializer<{
	fee: typeof asset,
	registrar: typeof accountId,
    did_identifier: StringSerializer,
}>;
