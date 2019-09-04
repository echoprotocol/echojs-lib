import { accountId } from '../chain/id/protocol';
import PublicKeySerializer from '../chain/PublicKey';
import { uint32 } from '../basic/integers';
import { struct, map } from '../collections';
import { weight } from '../chain';

const authoritySerializer = struct({
	weight_threshold: uint32,
	account_auths: map(accountId, weight),
	key_auths: map(new PublicKeySerializer(), weight),
});
export default authoritySerializer;
