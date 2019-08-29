import { uint64, uint32, int64 } from '../basic/integers';
import { OPERATIONS_IDS } from '../../constants';
import { staticVariant, struct, StructSerializer, StaticVariantSerializer } from '../collections';
import ISerializer from '../ISerializer';
import OperationId from '../../interfaces/OperationId';

export declare const defaultFeeParametersSerializer: StructSerializer<{ fee: typeof uint64 }>;

export declare const feeParametersWithPricePerKByte: StructSerializer<{
	fee: typeof uint64,
	price_per_kbyte: typeof uint32,
}>;

export type FeeParametersSerializer<T extends OperationId> = {
	[OperationId.TRANSFER]: typeof defaultFeeParametersSerializer,
	[OperationId.ACCOUNT_CREATE]: StructSerializer<{
		basic_fee: typeof uint64,
		premium_fee: typeof uint64,
		price_per_kbyte: typeof uint32,
	}>,
	[OperationId.ACCOUNT_UPDATE]: StructSerializer<{ fee: typeof int64, price_per_kbyte: typeof uint32 }>,
	[OperationId.ACCOUNT_WHITELIST]: StructSerializer<{ fee: typeof int64 }>,
	[OperationId.ACCOUNT_TRANSFER]: typeof defaultFeeParametersSerializer,
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
	[OperationId.PROPOSAL_CREATE]: typeof feeParametersWithPricePerKByte,
	[OperationId.PROPOSAL_UPDATE]: typeof feeParametersWithPricePerKByte,
	[OperationId.PROPOSAL_DELETE]: typeof defaultFeeParametersSerializer,
	[OperationId.COMMITTEE_MEMBER_CREATE]: typeof defaultFeeParametersSerializer,
	[OperationId.COMMITTEE_MEMBER_UPDATE]: typeof defaultFeeParametersSerializer,
	[OperationId.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: typeof defaultFeeParametersSerializer,
	[OperationId.VESTING_BALANCE_CREATE]: typeof defaultFeeParametersSerializer,
	[OperationId.VESTING_BALANCE_WITHDRAW]: typeof defaultFeeParametersSerializer,
	[OperationId.BALANCE_CLAIM]: StructSerializer<{}>,
	[OperationId.OVERRIDE_TRANSFER]: typeof defaultFeeParametersSerializer,
	[OperationId.ASSET_CLAIM_FEES]: typeof defaultFeeParametersSerializer,
	[OperationId.CONTRACT_CREATE]: typeof defaultFeeParametersSerializer,
	[OperationId.CONTRACT_CALL]: typeof defaultFeeParametersSerializer,
	[OperationId.CONTRACT_TRANSFER]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_CHANGE_CONFIG]: typeof defaultFeeParametersSerializer,
	[OperationId.ACCOUNT_ADDRESS_CREATE]: typeof feeParametersWithPricePerKByte,
	[OperationId.TRANSFER_TO_ADDRESS]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ETH_CREATE_ADDRESS]: typeof defaultFeeParametersSerializer,
	[OperationId.SIDECHAIN_ETH_APPROVE_ADDRESS]: ISerializer,
	[OperationId.SIDECHAIN_ETH_DEPOSIT]: ISerializer,
	[OperationId.SIDECHAIN_ETH_WITHDRAW]: ISerializer,
	[OperationId.SIDECHAIN_ETH_APPROVE_WITHDRAW]: ISerializer,
	[OperationId.CONTRACT_FUND_POOL]: ISerializer,
	[OperationId.CONTRACT_WHITELIST]: ISerializer,
	[OperationId.SIDECHAIN_ETH_ISSUE]: ISerializer,
	[OperationId.SIDECHAIN_ETH_BURN]: ISerializer,
	[OperationId.SIDECHAIN_ERC20_REGISTER_TOKEN]: ISerializer,
	[OperationId.SIDECHAIN_ERC20_DEPOSIT_TOKEN]: ISerializer,
	[OperationId.SIDECHAIN_ERC20_WITHDRAW_TOKEN]: ISerializer,
	[OperationId.SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW]: ISerializer,
	[OperationId.CONTRACT_UPDATE]: ISerializer,
}[T];

declare const feeParametersSerializer: StaticVariantSerializer<{
	[operationId in OperationId]: FeeParametersSerializer<operationId>
}>;

export default feeParametersSerializer;
