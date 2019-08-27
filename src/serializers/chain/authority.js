import { accountId } from './id/protocol';
import PublicKeySerializer from './PublicKey';
import { uint32, uint16 } from '../basic/integers';
import { struct, map } from '../collections';

export const weightSerializer = uint16;

const authoritySerializer = struct({
	weight_threshold: uint32,
	account_auths: map(accountId, weightSerializer),
	key_auths: map(new PublicKeySerializer(), weightSerializer),
});
export default authoritySerializer;
