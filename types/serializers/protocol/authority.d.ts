import { accountId } from '../chain/id/protocol';
import PublicKeySerializer from '../chain/PublicKey';
import { uint32 } from '../basic/integers';
import { StructSerializer, MapSerializer } from '../collections';
import { weight } from '../chain';

declare const authoritySerializer: StructSerializer<{
	weight_threshold: typeof uint32,
	account_auths: MapSerializer<typeof accountId, typeof weight>,
	key_auths: MapSerializer<PublicKeySerializer, typeof weight>,
}>;
export default authoritySerializer;
