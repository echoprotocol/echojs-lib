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
		[OperationId.LIMIT_ORDER_CREATE]: default_fee<T>,
		[OperationId.LIMIT_ORDER_CANCEL]: default_fee<T>,
		[OperationId.CALL_ORDER_UPDATE]: default_fee<T>,
		[OperationId.FILL_ORDER]: no_fee,
		[OperationId.ACCOUNT_CREATE]: { basic_fee: uint64<T>, premium_fee: uint64<T>, price_per_kbyte: uint32<T> },
		[OperationId.ACCOUNT_UPDATE]: fee_with_price_per_kB<T>,
		[OperationId.ACCOUNT_WHITELIST]: default_fee<T>,
		[OperationId.ACCOUNT_UPGRADE]: { membership_annual_fee: uint64<T>, membership_lifetime_fee: uint64<T> },
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
		[OperationId.ASSET_SETTLE]: default_fee<T>,
		[OperationId.ASSET_GLOBAL_SETTLE]: default_fee<T>,
		[OperationId.ASSET_PUBLISH_FEED]: default_fee<T>,
		[OperationId.PROPOSAL_CREATE]: fee_with_price_per_kB<T>,
		[OperationId.PROPOSAL_UPDATE]: fee_with_price_per_kB<T>,
		[OperationId.PROPOSAL_DELETE]: default_fee<T>,
		[OperationId.WITHDRAW_PERMISSION_CREATE]: default_fee<T>,
		[OperationId.WITHDRAW_PERMISSION_UPDATE]: default_fee<T>,
		[OperationId.WITHDRAW_PERMISSION_CLAIM]: default_fee<T>,
		[OperationId.WITHDRAW_PERMISSION_DELETE]: default_fee<T>,
		[OperationId.COMMITTEE_MEMBER_CREATE]: default_fee<T>,
		[OperationId.COMMITTEE_MEMBER_UPDATE]: default_fee<T>,
		[OperationId.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: default_fee<T>,
		[OperationId.VESTING_BALANCE_CREATE]: default_fee<T>,
		[OperationId.VESTING_BALANCE_WITHDRAW]: default_fee<T>,
		[OperationId.CUSTOM]: fee_with_price_per_kB<T>,
		[OperationId.ASSERT]: default_fee<T>,
		[OperationId.BALANCE_CLAIM]: no_fee,
		[OperationId.OVERRIDE_TRANSFER]: default_fee<T>,
		[OperationId.ASSET_SETTLE_CANCEL]: no_fee,
		[OperationId.ASSET_CLAIM_FEES]: default_fee<T>,
		[OperationId.BID_COLLATERAL]: default_fee<T>,
		[OperationId.EXECUTE_BID]: no_fee,
		[OperationId.CREATE_CONTRACT]: default_fee<T>,
		[OperationId.CALL_CONTRACT]: default_fee<T>,
		[OperationId.CONTRACT_TRANSFER]: default_fee<T>,
		[OperationId.CHANGE_SIDECHAIN_CONFIG]: default_fee<T>,
		[OperationId.ACCOUNT_ADDRESS_CREATE]: fee_with_price_per_kB<T>,
		[OperationId.TRANSFER_TO_ADDRESS]: default_fee<T>,
		[OperationId.GENERATE_ETH_ADDRESS]: default_fee<T>,
		[OperationId.CREATE_ETH_ADDRESS]: default_fee<T>,
		[OperationId.DEPOSIT_ETH]: default_fee<T>,
		[OperationId.WITHDRAW_ETH]: default_fee<T>,
		[OperationId.APPROVE_WITHDRAW_ETH]: default_fee<T>,
		[OperationId.CONTRACT_FUND_POOL]: default_fee<T>,
		[OperationId.CONTRACT_WHITELIST]: default_fee<T>,
		[OperationId.SIDECHAIN_ISSUE]: default_fee<T>,
		[OperationId.SIDECHAIN_BURN]: default_fee<T>,
		[OperationId.REGISTER_ERC20_TOKEN]: { fee: uint64<T>, pool_fee: uint64<T> },
		[OperationId.DEPOSIT_ERC20_TOKEN]: default_fee<T>,
		[OperationId.WITHDRAW_ERC20_TOKEN]: default_fee<T>,
		[OperationId.APPROVE_ERC20_TOKEN_WITHDRAW]: default_fee<T>,
		[OperationId.CONTRACT_UPDATE]: default_fee<T>,
	}[TOperationId],
] : never;
