import { string as stringSerializer, bool } from '../basic';
import { asset, extensions } from '../chain';
import { accountId, assetId, contractId } from '../chain/id/protocol';
import { anyObjectId } from '../chain/id';
import { struct, optional, set } from '../collections';

export const contractBaseOperationPropsSerializer = struct({
	fee: asset,
	registrar: accountId,
	value: asset,
	code: stringSerializer,
});

export const contractCreateOperationPropsSerializer = struct({
	...contractBaseOperationPropsSerializer.serializers,
	supported_asset_id: optional(assetId),
	eth_accuracy: bool,
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

export const contractFundPoolOperationPropsSerializer = struct({
	fee: asset,
	sender: accountId,
	contract: contractId,
	value: asset,
	extensions,
});

export const contractWhitelistOperationPropsSerializer = struct({
	fee: asset,
	sender: accountId,
	contract: contractId,
	add_to_whitelist: set(accountId),
	remove_from_whitelist: set(accountId),
	add_to_blacklist: set(accountId),
	remove_from_blacklist: set(accountId),
	extensions,
});

export const contractUpdateOperationPropsSerializer = struct({
	fee: asset,
	sender: accountId,
	contract: contractId,
	new_owner: optional(accountId),
	extensions,
});
