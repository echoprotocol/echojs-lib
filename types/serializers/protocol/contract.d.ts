import { StringSerializer, bool } from '../basic';
import { asset, extensions } from '../chain';
import { accountId, assetId, contractId } from '../chain/id/protocol';
import { StructSerializer, OptionalSerializer } from '../collections';

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
