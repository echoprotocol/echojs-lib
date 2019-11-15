import { string as stringSerializer, bool } from '../basic';
import { asset, extensions } from '../chain';
import { accountId, assetId, contractId } from '../chain/id/protocol';
import { struct, optional, set, vector } from '../collections';

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

export const contractInternalCreateOperationPropsSerializer = struct({
	fee: asset,
	caller: contractId,
	new_contract: contractId,
	value: asset,
	eth_accuracy: bool,
	supported_asset_id: optional(assetId),
	extensions,
});

export const contractInternalCallOperationPropsSerializer = struct({
	fee: asset,
	caller: contractId,
	callee: accountId,
	method: stringSerializer,
	value: asset,
	extensions,
});

export const contractSelfdestructOperationPropsSerializer = struct({
	fee: asset,
	contract: contractId,
	recipient: accountId,
	amounts: vector(asset),
	extensions,
});
