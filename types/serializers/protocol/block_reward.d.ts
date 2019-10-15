import { StructSerializer, MapSerializer } from "../collections";
import { asset, extensions } from "../chain";
import { int64 } from '../basic/integers';
import { accountId } from "../chain/id/protocol";

export declare const blockRewardOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	reciever: typeof int64,
	amount: typeof int64,
	extensions: typeof extensions,
}>;
