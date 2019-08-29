import { asset, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { StructSerializer } from '../collections';
import { config } from '../plugins/sidechain';

export declare const sidechainChangeConfigOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	registrar: typeof accountId,
	new_config: typeof config,
	extensions: typeof extensions,
}>;
