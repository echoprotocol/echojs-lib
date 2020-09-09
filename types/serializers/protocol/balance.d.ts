import { asset, publicKey, extensions } from '../chain';
import { accountId, balanceId, frozenBalanceId } from '../chain/id/protocol';
import { uint16 } from '../basic/integers';
import { StructSerializer, VectorSerializer } from '../collections';

export declare const balanceClaimOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	deposit_to_account: typeof accountId,
	balance_to_claim: typeof balanceId,
	balance_owner_key: typeof publicKey,
	total_claimed: typeof asset,
	extensions: typeof extensions,
}>;

export declare const balanceFreezeOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	amount: typeof asset,
	duration: typeof uint16,
	extensions: typeof extensions,
}>;

export declare const balanceUnfreezeOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	amount: typeof asset,
	extensions: typeof extensions,
}>;

export declare const requestBalanceUnfreezeOperation: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	objects_to_unfreeze: VectorSerializer<typeof frozenBalanceId>,
	extensions: typeof extensions,
}>;
