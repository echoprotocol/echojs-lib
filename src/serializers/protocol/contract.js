import { string as stringSerializer, bool } from '../basic';
import { asset, extensions } from '../chain';
import { accountId, assetId, contractId } from '../chain/id/protocol';
import { anyObjectId } from '../chain/id';
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

export const contractCallOperationPropsSerializer = struct({
	...contractBaseOperationPropsSerializer.serializers,
	callee: contractId,
	extensions,
});

export const contractTransferOperationPropsSerializer = struct({
	fee: asset,
	from: contractId,
	to: anyObjectId,
	amount: asset,
	extensions,
});
