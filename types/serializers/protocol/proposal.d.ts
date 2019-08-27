import { timePointSec } from "../basic";
import { uint32 } from "../basic/integers";
import { asset, extensions } from "../chain";
import { accountId } from "../chain/id/protocol";
import { StructSerializer, VectorSerializer } from "../collections";
import OptionalSerializer from "../collections/Optional";
import { OperationSerializer } from "../operations";

export declare const proposalCreateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	fee_paying_account: typeof accountId,
	proposed_ops: VectorSerializer<OperationSerializer>,
	expiration_time: typeof timePointSec,
	review_period_seconds: OptionalSerializer<typeof uint32>,
	extensions: typeof extensions,
}>;
