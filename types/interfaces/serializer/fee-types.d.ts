import { uint64, uint32 } from "./basic-types";
import serialization from "./serialization";
import OperationId from "../OperationId";

export type no_fee = {}

export type default_fee<T extends serialization> = { fee: uint64<T> }

export type fee_with_price_per_kB<T extends serialization> = {
	fee: uint64<T>,
	price_per_kbyte: uint32<T>,
}

export default fee_parameters;
type fee_parameters<TOperationId extends OperationId, T extends serialization> = TOperationId extends any ? [
	TOperationId,
	{
		[OperationId.TRANSFER]: default_fee<T>,
		[OperationId.ACCOUNT_CREATE]: {
			basic_fee: uint64<T>,
			premium_fee: uint64<T>,
			price_per_kbyte: uint32<T>,
		},
		[OperationId.ACCOUNT_UPDATE]: fee_with_price_per_kB<T>,
		[OperationId.ACCOUNT_WHITELIST]: default_fee<T>,
		[OperationId.ACCOUNT_TRANSFER]: default_fee<T>,
		[OperationId.ASSET_CREATE]: {
			symbol3: uint64<T>,
			symbol4: uint64<T>,
			long_symbol: uint64<T>,
			price_per_kbyte: uint32<T>,
		},
		[OperationId.ASSET_UPDATE]: fee_with_price_per_kB<T>,
		[OperationId.ASSET_UPDATE_BITASSET]: default_fee<T>,
		[OperationId.ASSET_UPDATE_FEED_PRODUCERS]: default_fee<T>,
		[OperationId.ASSET_ISSUE]: fee_with_price_per_kB<T>,
		[OperationId.ASSET_RESERVE]: default_fee<T>,
		[OperationId.ASSET_FUND_FEE_POOL]: default_fee<T>,
		[OperationId.ASSET_PUBLISH_FEED]: default_fee<T>,
		[OperationId.PROPOSAL_CREATE]: fee_with_price_per_kB<T>,
		[OperationId.PROPOSAL_UPDATE]: fee_with_price_per_kB<T>,
		[OperationId.PROPOSAL_DELETE]: default_fee<T>,
		[OperationId.COMMITTEE_MEMBER_CREATE]: default_fee<T>,
		[OperationId.COMMITTEE_MEMBER_UPDATE]: default_fee<T>,
		[OperationId.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: default_fee<T>,
		[OperationId.VESTING_BALANCE_CREATE]: default_fee<T>,
		[OperationId.VESTING_BALANCE_WITHDRAW]: default_fee<T>,
		[OperationId.BALANCE_CLAIM]: no_fee,
		[OperationId.OVERRIDE_TRANSFER]: default_fee<T>,
		[OperationId.ASSET_CLAIM_FEES]: default_fee<T>,
		[OperationId.CONTRACT_CREATE]: default_fee<T>,
		[OperationId.CONTRACT_CALL]: default_fee<T>,
		[OperationId.CONTRACT_TRANSFER]: default_fee<T>,
		[OperationId.SIDECHAIN_CHANGE_CONFIG]: unknown,
		[OperationId.ACCOUNT_ADDRESS_CREATE]: unknown,
		[OperationId.TRANSFER_TO_ADDRESS]: unknown,
		[OperationId.SIDECHAIN_ETH_CREATE_ADDRESS]: unknown,
		[OperationId.SIDECHAIN_ETH_APPROVE_ADDRESS]: unknown,
		[OperationId.SIDECHAIN_ETH_DEPOSIT]: unknown,
		[OperationId.SIDECHAIN_ETH_WITHDRAW]: unknown,
		[OperationId.SIDECHAIN_ETH_APPROVE_WITHDRAW]: unknown,
		[OperationId.CONTRACT_FUND_POOL]: unknown,
		[OperationId.CONTRACT_WHITELIST]: unknown,
		[OperationId.SIDECHAIN_ETH_ISSUE]: unknown,
		[OperationId.SIDECHAIN_ETH_BURN]: unknown,
		[OperationId.SIDECHAIN_ERC20_REGISTER_TOKEN]: unknown,
		[OperationId.SIDECHAIN_ERC20_DEPOSIT_TOKEN]: unknown,
		[OperationId.SIDECHAIN_ERC20_WITHDRAW_TOKEN]: unknown,
		[OperationId.SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW]: unknown,
		[OperationId.CONTRACT_UPDATE]: unknown,
	}[TOperationId],
] : never;
