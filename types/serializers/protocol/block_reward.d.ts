import { StructSerializer, MapSerializer } from "../collections";
import { asset, extensions } from "../chain";
import { int64 } from '../basic/integers';
import { accountId } from "../chain/id/protocol";

export declare const blockRewardOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	rewards: MapSerializer<typeof accountId, typeof int64>,
	extensions: typeof extensions,
}>;

export default blockRewardOperationPropsSerializer;
