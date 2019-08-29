import { string as stringSerializer, bool } from '../basic';
import { asset, extensions } from '../chain';
import { accountId, assetId } from '../chain/id/protocol';
import { struct, optional } from '../collections';

export const contractBaseOperationPropsSerializer = struct({
	fee: asset,
	registrar: accountId,
	value: asset,
	code: stringSerializer,
});

export const contractCreateOperationPropsSerializer = struct({
	...contractBaseOperationPropsSerializer.serializers,
	eth_accuracy: bool,
	supported_asset_id: optional(assetId),
	extensions,
});
