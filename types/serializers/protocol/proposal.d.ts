import { timePointSec, bool } from "../basic";
import { uint32 } from "../basic/integers";
import { asset, extensions, publicKey } from "../chain";
import { accountId, proposalId } from "../chain/id/protocol";
import { StructSerializer, VectorSerializer, SetSerializer } from "../collections";
import OptionalSerializer from "../collections/Optional";
import OperationSerializer from "../operation";

export declare const proposalCreateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	fee_paying_account: typeof accountId,
	proposed_ops: VectorSerializer<OperationSerializer>,
	expiration_time: typeof timePointSec,
	review_period_seconds: OptionalSerializer<typeof uint32>,
	extensions: typeof extensions,
}>;

export declare const proposalUpdateOperationPropsSerializer: StructSerializer<{
	fee_paying_account: typeof accountId,
	fee: typeof asset,
	proposal: typeof proposalId,
	active_approvals_to_add: SetSerializer<typeof accountId>,
	active_apprivals_to_remove: SetSerializer<typeof accountId>,
	key_approvals_to_add: SetSerializer<typeof publicKey>,
	key_approvals_to_remove: SetSerializer<typeof publicKey>,
	extensions: typeof extensions,
}>;

export declare const proposalDeleteOperationPropsSerializer: StructSerializer<{
	fee_paying_account: typeof accountId,
	using_owner_authority: typeof bool,
	fee: typeof asset,
	proposal: typeof proposalId,
	extensions: typeof extensions,
}>;
