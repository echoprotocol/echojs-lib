enum OperationId {
	TRANSFER = 0,
	LIMIT_ORDER_CREATE = 1,
	LIMIT_ORDER_CANCEL = 2,
	CALL_ORDER_UPDATE = 3,
	FILL_ORDER = 4,
	ACCOUNT_CREATE = 5,
	ACCOUNT_UPDATE = 6,
	ACCOUNT_WHITELIST = 7,
	ACCOUNT_UPGRADE = 8,
	ACCOUNT_TRANSFER = 9,
	ASSET_CREATE = 10,
	ASSET_UPDATE = 11,
	ASSET_UPDATE_BITASSET = 12,
	ASSET_UPDATE_FEED_PRODUCERS = 13,
	ASSET_ISSUE = 14,
	ASSET_RESERVE = 15,
	ASSET_FUND_FEE_POOL = 16,
	ASSET_SETTLE = 17,
	ASSET_GLOBAL_SETTLE = 18,
	ASSET_PUBLISH_FEED = 19,
	PROPOSAL_CREATE = 20,
	PROPOSAL_UPDATE = 21,
	PROPOSAL_DELETE = 22,
	WITHDRAW_PERMISSION_CREATE = 23,
	WITHDRAW_PERMISSION_UPDATE = 24,
	WITHDRAW_PERMISSION_CLAIM = 25,
	WITHDRAW_PERMISSION_DELETE = 26,
	COMMITTEE_MEMBER_CREATE = 27,
	COMMITTEE_MEMBER_UPDATE = 28,
	COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS = 29,
	VESTING_BALANCE_CREATE = 30,
	VESTING_BALANCE_WITHDRAW = 31,
	CUSTOM = 32,
	ASSERT = 33,
	BALANCE_CLAIM = 34,
	OVERRIDE_TRANSFER = 35,
	ASSET_SETTLE_CANCEL = 36,
	ASSET_CLAIM_FEES = 37,
	BID_COLLATERAL = 38,
	EXECUTE_BID = 39,
	CREATE_CONTRACT = 40,
	CALL_CONTRACT = 41,
	CONTRACT_TRANSFER = 42,
	CHANGE_SIDECHAIN_CONFIG = 43,
	ACCOUNT_ADDRESS_CREATE = 44,
	TRANSFER_TO_ADDRESS = 45,
	GENERATE_ETH_ADDRESS = 46,
	CREATE_ETH_ADDRESS = 47,
	DEPOSIT_ETH = 48,
	WITHDRAW_ETH = 49,
	APPROVE_WITHDRAW_ETH = 50,
	CONTRACT_FUND_POOL = 51,
	CONTRACT_WHITELIST = 52,
	SIDECHAIN_ISSUE = 53,
	SIDECHAIN_BURN = 54,
	REGISTER_ERC20_TOKEN = 55,
	DEPOSIT_ERC20_TOKEN = 56,
	WITHDRAW_ERC20_TOKEN = 57,
	APPROVE_ERC20_TOKEN_WITHDRAW = 58,
	CONTRACT_UPDATE = 59,
}

export default OperationId;