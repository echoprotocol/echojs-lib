import { account_id, asset_id, bytes } from "./basic-types";
import serialization from "./serialization";

export interface account_name_eq_lit_predicate {
	account_id: account_id,
	name: string,
}

export interface asset_symbol_eq_lit_predicate {
	asset_id: asset_id,
	symbol: string,
}

export interface block_id_predicate<T extends serialization> { id: bytes<T> }

export enum PredicateType {
	ACCOUNT_NAME_EQ_LIT = 0,
	ASSET_SYMBOL_EQ_LIT = 1,
	BLOCK_ID = 2,
}

export default predicate;
type predicate<T extends serialization, TType extends PredicateType = PredicateType> = TType extends any ? {
	[PredicateType.ACCOUNT_NAME_EQ_LIT]: account_name_eq_lit_predicate,
	[PredicateType.ASSET_SYMBOL_EQ_LIT]: asset_symbol_eq_lit_predicate,
	[PredicateType.BLOCK_ID]: block_id_predicate<T>,
}[TType] : never;
