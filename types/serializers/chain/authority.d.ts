import { accountId } from './id/protocol';
import PublicKeySerializer from './PublicKey';
import { uint32, uint16 } from '../basic/integers';
import { struct, map, StructSerializer, MapSerializer } from '../collections';

export declare const weightSerializer: typeof uint16;

declare const authoritySerializer: StructSerializer<{
	weight_threshold: typeof uint32,
	account_auths: MapSerializer<typeof accountId, typeof weightSerializer>,
	key_auths: MapSerializer<PublicKeySerializer, typeof weightSerializer>,
}>;
export default authoritySerializer;
