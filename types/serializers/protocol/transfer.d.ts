import { StructSerializer } from "../collections";
import { asset, extensions, ripemd160 } from "../chain";
import { accountId } from "../chain/id/protocol";

export declare const transferOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	from: typeof accountId,
	to: typeof accountId,
	amount: typeof asset,
	extensions: typeof extensions,
}>;

export declare const overrideTransferOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	issuer: typeof accountId,
	from: typeof accountId,
	to: typeof accountId,
	amount: typeof asset,
	extensions: typeof extensions,
}>;

export declare const transferToAddressOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	from: typeof accountId,
	to: typeof ripemd160,
	amount: typeof asset,
	extensions: typeof extensions,
}>;
