import { uint64, uint32, int64 } from '../basic/integers';
import { OPERATIONS_IDS } from '../../constants';
import { staticVariant, struct } from '../collections';

export const defaultFeeParametersSerializer = struct({ fee: uint64 });

export const feeParametersWithPricePerKByte = struct({ fee: uint64, price_per_kbyte: uint32 });

const feeParametersSerializer = staticVariant({
	[OPERATIONS_IDS.TRANSFER]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.ACCOUNT_CREATE]: struct({ basic_fee: uint64, premium_fee: uint64, price_per_kbyte: uint32 }),
	[OPERATIONS_IDS.ACCOUNT_UPDATE]: struct({ fee: int64, price_per_kbyte: uint32 }),
	[OPERATIONS_IDS.ACCOUNT_WHITELIST]: struct({ fee: int64 }),
	[OPERATIONS_IDS.ACCOUNT_TRANSFER]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.ASSET_CREATE]: struct({
		symbol3: uint64,
		symbol4: uint64,
		long_symbol: uint64,
		price_per_kbyte: uint32,
	}),
	[OPERATIONS_IDS.ASSET_UPDATE]: feeParametersWithPricePerKByte,
	[OPERATIONS_IDS.ASSET_UPDATE_BITASSET]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.ASSET_UPDATE_FEED_PRODUCERS]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.ASSET_ISSUE]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.ASSET_RESERVE]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.ASSET_FUND_FEE_POOL]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.ASSET_PUBLISH_FEED]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.PROPOSAL_CREATE]: feeParametersWithPricePerKByte,
	[OPERATIONS_IDS.PROPOSAL_UPDATE]: feeParametersWithPricePerKByte,
	[OPERATIONS_IDS.PROPOSAL_DELETE]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.COMMITTEE_MEMBER_CREATE]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.COMMITTEE_MEMBER_UPDATE]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.VESTING_BALANCE_CREATE]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.VESTING_BALANCE_WITHDRAW]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.BALANCE_CLAIM]: struct({}),
	[OPERATIONS_IDS.OVERRIDE_TRANSFER]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.ASSET_CLAIM_FEES]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.CONTRACT_CREATE]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.CONTRACT_CALL]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.CONTRACT_TRANSFER]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.SIDECHAIN_CHANGE_CONFIG]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.ACCOUNT_ADDRESS_CREATE]: feeParametersWithPricePerKByte,
	[OPERATIONS_IDS.TRANSFER_TO_ADDRESS]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.SIDECHAIN_ETH_CREATE_ADDRESS]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.SIDECHAIN_ETH_APPROVE_ADDRESS]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.SIDECHAIN_ETH_DEPOSIT]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.SIDECHAIN_ETH_WITHDRAW]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.SIDECHAIN_ETH_APPROVE_WITHDRAW]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.CONTRACT_FUND_POOL]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.CONTRACT_WHITELIST]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.SIDECHAIN_ETH_ISSUE]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.SIDECHAIN_ETH_BURN]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.SIDECHAIN_ERC20_REGISTER_TOKEN]: struct({ fee: uint64, pool_fee: uint64 }),
	[OPERATIONS_IDS.SIDECHAIN_ERC20_DEPOSIT_TOKEN]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.SIDECHAIN_ERC20_WITHDRAW_TOKEN]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW]: defaultFeeParametersSerializer,
	[OPERATIONS_IDS.CONTRACT_UPDATE]: struct({ fee: int64 }),
});

export default feeParametersSerializer;