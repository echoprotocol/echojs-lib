import { StringSerializer, bool } from '../basic';
import { asset, extensions } from '../chain';
import { objectId } from '../chain/id';
import { accountId, assetId, contractId } from '../chain/id/protocol';
import { StructSerializer, OptionalSerializer, SetSerializer, VectorSerializer } from '../collections';

export declare const contractBaseOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	registrar: typeof accountId,
	value: typeof asset,
	code: StringSerializer,
}>;

export declare const contractCreateOperationPropsSerializer: StructSerializer<
	typeof contractBaseOperationPropsSerializer['serializers'] &
	{
		eth_accuracy: typeof bool,
		supported_asset_id: OptionalSerializer<typeof assetId>,
		extensions: typeof extensions,
	}
>;

export declare const contractCallOperationPropsSerializer: StructSerializer<
	typeof contractBaseOperationPropsSerializer['serializers'] &
	{
		callee: typeof contractId,
		extensions: typeof extensions,
	}
>;

export declare const contractFundPoolOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	sender: typeof accountId,
	contract: typeof contractId,
	value: typeof asset,
	extensions: typeof extensions,
}>;

export declare const contractWhitelistOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	sender: typeof accountId,
	contract: typeof contractId,
	add_to_whitelist: SetSerializer<typeof accountId>,
	remove_from_whitelist: SetSerializer<typeof accountId>,
	add_to_blacklist: SetSerializer<typeof accountId>,
	remove_from_blacklist: SetSerializer<typeof accountId>,
	extensions: typeof extensions,
}>;

export declare const contractUpdateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	sender: typeof accountId,
	contract: typeof contractId,
	new_owner: OptionalSerializer<typeof accountId>,
	extensions: typeof extensions,
}>;

export declare const contractInternalCreateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	caller: typeof contractId,
	new_contract: typeof contractId,
	value: typeof asset,
	eth_accuracy: typeof bool,
	supported_asset_id: OptionalSerializer<typeof assetId>,
	extensions: typeof extensions,
}>;

export declare const contractInternalCallOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	caller: typeof contractId,
	callee: typeof accountId,
	method: StringSerializer,
	value: typeof asset,
	extensions: typeof extensions,
}>;

export declare const contractSelfdestructOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	contract: typeof contractId,
	recipient: typeof accountId,
	amounts: VectorSerializer<typeof asset>,
	extensions: typeof extensions,
}>;
