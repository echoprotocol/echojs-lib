import { uint64, uint32, int64 } from '../basic/integers';
import { OPERATIONS_IDS } from '../../constants';
import { staticVariant, struct, StructSerializer, StaticVariantSerializer } from '../collections';
import OperationId from '../../interfaces/OperationId';

export declare const defaultFeeParametersSerializer: StructSerializer<{ fee: typeof uint64 }>;

export declare const feeParametersWithPricePerKByte: StructSerializer<{
	fee: typeof uint64,
	price_per_kbyte: typeof uint32,
}>;

export type FeeParametersSerializer<T extends OperationId> = {
	[OperationId.TRANSFER]: typeof defaultFeeParametersSerializer,
	[OperationId.TRANSFER_TO_ADDRESS]: typeof defaultFeeParametersSerializer,
	[OperationId.OVERRIDE_TRANSFER]: typeof defaultFeeParametersSerializer,
	[OperationId.ACCOUNT_CREATE]: StructSerializer<{
		basic_fee: typeof uint64,
		premium_fee: typeof uint64,
		price_per_kbyte: typeof uint32,
	}>,
	[OperationId.ACCOUNT_UPDATE]: StructSerializer<{ fee: typeof int64, price_per_kbyte: typeof uint32 }>,
	[OperationId.ACCOUNT_WHITELIST]: StructSerializer<{ fee: typeof int64 }>,
	[OperationId.ACCOUNT_ADDRESS_CREATE]: typeof feeParametersWithPricePerKByte,
	[OperationId.ASSET_CREATE]: StructSerializer<{
		symbol3: typeof uint64,
		symbol4: typeof uint64,
		long_symbol: typeof uint64,
		price_per_kbyte: typeof uint32,
	}>,
	[OperationId.ASSET_UPDATE]: typeof feeParametersWithPricePerKByte,
	[OperationId.ASSET_UPDATE_BITASSET]: typeof defaultFeeParametersSerializer,
	[OperationId.ASSET_UPDATE_FEED_PRODUCERS]: typeof defaultFeeParametersSerializer,
	[OperationId.ASSET_ISSUE]: typeof defaultFeeParametersSerializer,
	[OperationId.ASSET_RESERVE]: typeof defaultFeeParametersSerializer,
	[OperationId.ASSET_FUND_FEE_POOL]: typeof defaultFeeParametersSerializer,
	[OperationId.ASSET_PUBLISH_FEED]: typeof defaultFeeParametersSerializer,
	[OperationId.ASSET_CLAIM_FEES]: typeof defaultFeeParametersSerializer,
	[OperationId.PROPOSAL_CREATE]: typeof feeParametersWithPricePerKByte,
	[OperationId.PROPOSAL_UPDATE]: typeof feeParametersWithPricePerKByte,
	[OperationId.PROPOSAL_DELETE]: typeof defaultFeeParametersSerializer,
	[OperationId.COMMITTEE_MEMBER_CREATE]: typeof defaultFeeParametersSerializer,
	[OperationId.COMMITTEE_MEMBER_UPDATE]: typeof defaultFeeParametersSerializer,
	[OperationId.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: typeof defaultFeeParametersSerializer,
	[OperationId.COMMITTEE_MEMBER_ACTIVATE]: typeof defaultFeeParametersSerializer,
	[OperationId.COMMITTEE_MEMBER_DEACTIVATE]: typeof defaultFeeParametersSerializer,
	[OperationId.COMMITTEE_FROZEN_BALANCE_DEPOSIT]: typeof defaultFeeParametersSerializer,
	[OperationId.COMMITTEE_FROZEN_BALANCE_WITHDRAW]: typeof defaultFeeParametersSerializer,
	[OperationId.VESTING_BALANCE_CREATE]: typeof defaultFeeParametersSerializer,
	[OperationId.VESTING_BALANCE_WITHDRAW]: typeof defaultFeeParametersSerializer,
	[OperationId.BALANCE_CLAIM]: StructSerializer<{}>,
	[OperationId.BALANCE_FREEZE]: StructSerializer<{}>,
	[OperationId.BALANCE_UNFREEZE]: typeof defaultFeeParametersSerializer,
	[OperationId.CONTRACT_CREATE]: typeof defaultFeeParametersSerializer,
	[OperationId.CONTRACT_CALL]: typeof defaultFeeParametersSerializer,
	[OperationId.CONTRACT_INTERNAL_CREATE]: typeof defaultFeeParametersSerializer,
	[OperationId.CONTRACT_INTERNAL_CALL]: typeof defaultFeeParametersSerializer,
	[OperationId.CONTRACT_SELFDESTRUCT]: typeof defaultFeeParametersSerializer,
	[OperationId.CONTRACT_UPDATE]: StructSerializer<{ fee: typeof int64 }>,
	[OperationId.CONTRACT_FUND_POOL]: typeof defaultFeeParametersSerializer,
	[OperationId.CONTRACT_WHITELIST]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ETH_CREATE_ADDRESS]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ETH_APPROVE_ADDRESS]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ETH_DEPOSIT]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ETH_SEND_DEPOSIT]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ETH_WITHDRAW]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ETH_SEND_WITHDRAW]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ETH_APPROVE_WITHDRAW]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ETH_UPDATE_CONTRACT_ADDRESS]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ISSUE]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_BURN]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ERC20_REGISTER_TOKEN]: StructSerializer<{ fee: typeof uint64, pool_fee: typeof uint64 }>,
	[OperationId.SIDECHAIN_ERC20_DEPOSIT_TOKEN]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ERC20_SEND_DEPOSIT_TOKEN]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ERC20_WITHDRAW_TOKEN]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ERC20_SEND_WITHDRAW_TOKEN]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ERC20_ISSUE]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ERC20_BURN]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_BTC_CREATE_ADDRESS]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_BTC_CREATE_INTERMEDIATE_DEPOSIT]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_BTC_INTERMEDIATE_DEPOSIT]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_BTC_DEPOSIT]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_BTC_WITHDRAW]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_BTC_AGGREGATE]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_BTC_APPROVE_AGGREGATE]: typeof defaultFeeParametersSerializer,
	[OperationId.BLOCK_REWARD]: typeof defaultFeeParametersSerializer,
	[OperationId.EVM_ADDRESS_REGISTER]: typeof defaultFeeParametersSerializer,
	[OperationId.DID_CREATE_OPERATION]: typeof defaultFeeParametersSerializer,
	[OperationId.DID_UPDATE_OPERATION]: typeof defaultFeeParametersSerializer,
	[OperationId.DID_DELETE_OPERATION]: typeof defaultFeeParametersSerializer,
}[T];

declare const feeParametersSerializer: StaticVariantSerializer<{
	[operationId in OperationId]: FeeParametersSerializer<operationId>
}>;

export default feeParametersSerializer;
