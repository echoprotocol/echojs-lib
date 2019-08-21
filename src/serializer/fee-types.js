import serializable from './serializable';
import { uint64, uint32 } from './basic-types';
import * as OperationsIds from '../constants/operations-ids';

const noFee = serializable({});
const defaultFee = serializable({ fee: uint64 });

const withPricePerKB = serializable({
	fee: uint64,
	price_per_kbyte: uint32,
});

export default {
	[OperationsIds.TRANSFER]: defaultFee,
	[OperationsIds.ACCOUNT_CREATE]: serializable({
		basic_fee: uint64,
		premium_fee: uint64,
		price_per_kbyte: uint32,
	}),
	[OperationsIds.ACCOUNT_UPDATE]: withPricePerKB,
	[OperationsIds.ACCOUNT_WHITELIST]: defaultFee,
	[OperationsIds.ACCOUNT_TRANSFER]: defaultFee,
	[OperationsIds.ASSET_CREATE]: serializable({
		symbol3: uint64,
		symbol4: uint64,
		long_symbol: uint64,
		price_per_kbyte: uint32,
	}),
	[OperationsIds.ASSET_UPDATE]: withPricePerKB,
	[OperationsIds.ASSET_UPDATE_BITASSET]: defaultFee,
	[OperationsIds.ASSET_UPDATE_FEED_PRODUCERS]: defaultFee,
	[OperationsIds.ASSET_ISSUE]: withPricePerKB,
	[OperationsIds.ASSET_RESERVE]: defaultFee,
	[OperationsIds.ASSET_FUND_FEE_POOL]: defaultFee,
	[OperationsIds.ASSET_PUBLISH_FEED]: defaultFee,
	[OperationsIds.PROPOSAL_CREATE]: withPricePerKB,
	[OperationsIds.PROPOSAL_UPDATE]: withPricePerKB,
	[OperationsIds.PROPOSAL_DELETE]: defaultFee,
	[OperationsIds.COMMITTEE_MEMBER_CREATE]: defaultFee,
	[OperationsIds.COMMITTEE_MEMBER_UPDATE]: defaultFee,
	[OperationsIds.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: defaultFee,
	[OperationsIds.VESTING_BALANCE_CREATE]: defaultFee,
	[OperationsIds.VESTING_BALANCE_WITHDRAW]: defaultFee,
	[OperationsIds.BALANCE_CLAIM]: noFee,
	[OperationsIds.OVERRIDE_TRANSFER]: defaultFee,
	[OperationsIds.ASSET_CLAIM_FEES]: defaultFee,
	[OperationsIds.CONTRACT_CREATE]: defaultFee,
	[OperationsIds.CONTRACT_CALL]: defaultFee,
	[OperationsIds.CONTRACT_TRANSFER]: defaultFee,
	[OperationsIds.SIDECHAIN_CHANGE_CONFIG]: defaultFee,
	[OperationsIds.ACCOUNT_ADDRESS_CREATE]: withPricePerKB,
	[OperationsIds.TRANSFER_TO_ADDRESS]: defaultFee,
	[OperationsIds.SIDECHAIN_ETH_CREATE_ADDRESS]: defaultFee,
	[OperationsIds.SIDECHAIN_ETH_APPROVE_ADDRESS]: defaultFee,
	[OperationsIds.SIDECHAIN_ETH_DEPOSIT]: defaultFee,
	[OperationsIds.SIDECHAIN_ETH_WITHDRAW]: defaultFee,
	[OperationsIds.SIDECHAIN_ETH_APPROVE_WITHDRAW]: defaultFee,
	[OperationsIds.CONTRACT_FUND_POOL]: defaultFee,
	[OperationsIds.CONTRACT_WHITELIST]: defaultFee,
	[OperationsIds.SIDECHAIN_ETH_ISSUE]: defaultFee,
	[OperationsIds.SIDECHAIN_ETH_BURN]: defaultFee,
	[OperationsIds.SIDECHAIN_ERC20_REGISTER_TOKEN]: serializable({ fee: uint64, pool_fee: uint64 }),
	[OperationsIds.SIDECHAIN_ERC20_DEPOSIT_TOKEN]: defaultFee,
	[OperationsIds.SIDECHAIN_ERC20_WITHDRAW_TOKEN]: defaultFee,
	[OperationsIds.SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW]: defaultFee,
	[OperationsIds.CONTRACT_UPDATE]: defaultFee,
};
