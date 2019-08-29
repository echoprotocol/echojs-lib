import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { struct } from '../collections';
import { config } from '../plugins/sidechain';

// eslint-disable-next-line import/prefer-default-export
export const sidechainChangeConfigOperationPropsSerializer = struct({
	fee: asset,
	registrar: accountId,
	new_config: config,
	extensions,
});
