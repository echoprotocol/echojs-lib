import serializable from './serializable';
import { uint64, uint32 } from './basic-types';
import {
	TRANSFER,
	ACCOUNT_CREATE,
	ACCOUNT_UPDATE,
	ACCOUNT_WHITELIST,
	ACCOUNT_TRANSFER,
	ASSET_CREATE,
	ASSET_UPDATE,
	ASSET_UPDATE_BITASSET,
	ASSET_UPDATE_FEED_PRODUCERS,
	ASSET_ISSUE,
	ASSET_RESERVE,
	ASSET_FUND_FEE_POOL,
	ASSET_PUBLISH_FEED,
	PROPOSAL_CREATE,
	PROPOSAL_UPDATE,
	PROPOSAL_DELETE,
	COMMITTEE_MEMBER_CREATE,
	COMMITTEE_MEMBER_UPDATE,
	COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS,
	VESTING_BALANCE_CREATE,
	VESTING_BALANCE_WITHDRAW,
	BALANCE_CLAIM,
	OVERRIDE_TRANSFER,
	ASSET_CLAIM_FEES,
	CREATE_CONTRACT,
	CALL_CONTRACT,
	CONTRACT_TRANSFER,
} from '../constants/operations-ids';

const noFee = serializable({});
const defaultFee = serializable({ fee: uint64 });

const withPricePerKB = serializable({
	fee: uint64,
	price_per_kbyte: uint32,
});

export default {
	[TRANSFER]: defaultFee,
	[ACCOUNT_CREATE]: serializable({
		basic_fee: uint64,
		premium_fee: uint64,
		price_per_kbyte: uint32,
	}),
	[ACCOUNT_UPDATE]: withPricePerKB,
	[ACCOUNT_WHITELIST]: defaultFee,
	[ACCOUNT_TRANSFER]: defaultFee,
	[ASSET_CREATE]: serializable({
		symbol3: uint64,
		symbol4: uint64,
		long_symbol: uint64,
		price_per_kbyte: uint32,
	}),
	[ASSET_UPDATE]: withPricePerKB,
	[ASSET_UPDATE_BITASSET]: defaultFee,
	[ASSET_UPDATE_FEED_PRODUCERS]: defaultFee,
	[ASSET_ISSUE]: withPricePerKB,
	[ASSET_RESERVE]: defaultFee,
	[ASSET_FUND_FEE_POOL]: defaultFee,
	[ASSET_PUBLISH_FEED]: defaultFee,
	[PROPOSAL_CREATE]: withPricePerKB,
	[PROPOSAL_UPDATE]: withPricePerKB,
	[PROPOSAL_DELETE]: defaultFee,
	[COMMITTEE_MEMBER_CREATE]: defaultFee,
	[COMMITTEE_MEMBER_UPDATE]: defaultFee,
	[COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: defaultFee,
	[VESTING_BALANCE_CREATE]: defaultFee,
	[VESTING_BALANCE_WITHDRAW]: defaultFee,
	[BALANCE_CLAIM]: noFee,
	[OVERRIDE_TRANSFER]: defaultFee,
	[ASSET_CLAIM_FEES]: defaultFee,
	[CREATE_CONTRACT]: defaultFee,
	[CALL_CONTRACT]: defaultFee,
	[CONTRACT_TRANSFER]: defaultFee,
};
