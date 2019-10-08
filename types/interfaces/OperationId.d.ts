export default OperationId;
declare enum OperationId {
	TRANSFER = 0,
	ACCOUNT_CREATE = 1,
	ACCOUNT_UPDATE = 2,
	ACCOUNT_WHITELIST = 3,
	ASSET_CREATE = 4,
	ASSET_UPDATE = 5,
	ASSET_UPDATE_BITASSET = 6,
	ASSET_UPDATE_FEED_PRODUCERS = 7,
	ASSET_ISSUE = 8,
	ASSET_RESERVE = 9,
	ASSET_FUND_FEE_POOL = 10,
	ASSET_PUBLISH_FEED = 11,
	PROPOSAL_CREATE = 12,
	PROPOSAL_UPDATE = 13,
	PROPOSAL_DELETE = 14,
	COMMITTEE_MEMBER_CREATE = 15,
	COMMITTEE_MEMBER_UPDATE = 16,
	COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS = 17,
	VESTING_BALANCE_CREATE = 18,
	VESTING_BALANCE_WITHDRAW = 19,
	BALANCE_CLAIM = 20,
	BALANCE_FREEZE = 21,
	OVERRIDE_TRANSFER = 22,
	ASSET_CLAIM_FEES = 23,
	CONTRACT_CREATE = 24,
	CONTRACT_CALL = 25,
	CONTRACT_TRANSFER = 26,
	CONTRACT_UPDATE = 27,
	ACCOUNT_ADDRESS_CREATE = 28,
	TRANSFER_TO_ADDRESS = 29,
	SIDECHAIN_ETH_CREATE_ADDRESS = 30,
	SIDECHAIN_ETH_APPROVE_ADDRESS = 31,
	SIDECHAIN_ETH_DEPOSIT = 32,
	SIDECHAIN_ETH_WITHDRAW = 33,
	SIDECHAIN_ETH_APPROVE_WITHDRAW = 34,
	CONTRACT_FUND_POOL = 35,
	CONTRACT_WHITELIST = 36,
	SIDECHAIN_ETH_ISSUE = 37,
	SIDECHAIN_ETH_BURN = 38,
	SIDECHAIN_ERC20_REGISTER_TOKEN = 39,
	SIDECHAIN_ERC20_DEPOSIT_TOKEN = 40,
	SIDECHAIN_ERC20_WITHDRAW_TOKEN = 41,
	SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW = 42,
	// SIDECHAIN_ERC20_ISSUE = 43,
	// SIDECHAIN_ERC20_BURN = 44,
	SIDECHAIN_BTC_CREATE_ADDRESS = 45,
	SIDECHAIN_BTC_INTERMEDIATE_DEPOSIT = 46,
	SIDECHAIN_BTC_DEPOSIT = 47,
	SIDECHAIN_BTC_WITHDRAW = 48,
	SIDECHAIN_BTC_APPROVE_WITHDRAW = 49,
	SIDECHAIN_BTC_AGGREGATE = 50,
}
