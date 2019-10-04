import { asset, publicKey, extensions } from '../chain';
import { accountId, balanceId } from '../chain/id/protocol';
import { uint16 } from '../basic/integers';

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
