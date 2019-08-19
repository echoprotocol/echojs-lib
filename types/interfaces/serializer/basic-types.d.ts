import BigNumber from "bignumber.js";
import serialization, { serialization_input } from "./serialization";
import PublicKey from "../../crypto/public-key";

export type bool = boolean;

type numeric<T extends serialization> = T extends serialization_input ? number | string | BigNumber : string;
export type uint8<T extends serialization> = numeric<T>;
export type uint16<T extends serialization> = numeric<T>;
export type uint32<T extends serialization> = numeric<T>;
export type uint64<T extends serialization> = numeric<T>;
export type int64<T extends serialization> = numeric<T>;

export type time_point_sec<T extends serialization> = T extends serialization_input ? number | Date | string : string;
export type bytes<T extends serialization> = T extends serialization_input ? string | Buffer : string;

type object_id = string;
export type account_id = object_id;
export type asset_id = object_id;
export type limit_order_id = object_id;
export type proposal_id = object_id;
export type withdraw_permission_id = object_id;
export type committee_member_id = object_id;
export type contract_id = object_id;
export type vesting_balance_id = object_id;
export type balance_id = object_id;
export type force_settlement_id = object_id;
export type eth_deposit_id = object_id;
export type eth_address_id = object_id;
export type erc20_token_id = object_id;

export type public_key<T extends serialization> = T extends serialization_input ? PublicKey | string : string;
export type vote_id<T extends serialization> =
	T extends serialization_input ? string | { type: number, id: number } : string;

export type optional<T> = undefined | T;
export type set<T> = undefined | T[] | Set<T>;
export type map<TKey, TValue> = [TKey, TValue][];
