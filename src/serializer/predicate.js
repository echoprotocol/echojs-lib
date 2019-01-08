import { protocolId, string, bytes, staticVariant } from './basic-types';
import serializable from './serializable';
import { ACCOUNT, ASSET } from '../constants/object-types';

export const accountNameEqLitPredicate = serializable({
	account_id: protocolId(ACCOUNT),
	name: string,
});

export const assetSymbolEqLitPredicate = serializable({
	asset_id: protocolId(ASSET),
	symbol: string,
});

export const blockIdPredicate = serializable({ id: bytes(20) });

export const ACCOUNT_NAME_EQ_LIT_PREDICATE = 0;
export const ASSET_SYMBOL_EQ_LIT_PREDICATE = 1;
export const BLOCK_ID_PREDICATE = 2;

export default staticVariant({
	[ACCOUNT_NAME_EQ_LIT_PREDICATE]: accountNameEqLitPredicate,
	[ASSET_SYMBOL_EQ_LIT_PREDICATE]: assetSymbolEqLitPredicate,
	[BLOCK_ID_PREDICATE]: blockIdPredicate,
});
