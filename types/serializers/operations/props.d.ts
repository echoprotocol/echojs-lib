import { StructSerializer } from "../collections";
import { asset, extensions } from "../chain";
import { accountId } from "../chain/id";

export declare const transfer: StructSerializer<{
	fee: typeof asset,
	from: typeof accountId,
	to: typeof accountId,
	amount: typeof asset,
	extensions: typeof extensions,
}>;
