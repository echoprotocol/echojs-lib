import { StructSerializer } from "../collections";
import { asset, extensions, publicKey } from "../chain";
import { accountId, balanceId } from "../chain/id/protocol";

export declare const transfer: StructSerializer<{
	fee: typeof asset,
	from: typeof accountId,
	to: typeof accountId,
	amount: typeof asset,
	extensions: typeof extensions,
}>;

export declare const balanceClaim: StructSerializer<{
	fee: typeof asset,
	deposit_to_account: typeof accountId,
	balance_to_claim: typeof balanceId,
	balance_owner_key: typeof publicKey,
	total_claimed: typeof asset,
	extensions: typeof extensions,
}>;
