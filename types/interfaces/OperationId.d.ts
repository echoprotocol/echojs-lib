export default OperationId;
declare enum OperationId {
	TRANSFER = 0,
	TRANSFER_TO_ADDRESS = 1,
	OVERRIDE_TRANSFER = 2,
	ACCOUNT_CREATE = 3,
	ACCOUNT_UPDATE = 4,
	ACCOUNT_WHITELIST = 5,
	ACCOUNT_ADDRESS_CREATE = 6,
	ASSET_CREATE = 7,
	ASSET_UPDATE = 8,
	ASSET_UPDATE_BITASSET = 9,
	ASSET_UPDATE_FEED_PRODUCERS = 10,
	ASSET_ISSUE = 11,
	ASSET_RESERVE = 12,
	ASSET_FUND_FEE_POOL = 13,
	ASSET_PUBLISH_FEED = 14,
	ASSET_CLAIM_FEES = 15,
	PROPOSAL_CREATE = 16,
	PROPOSAL_UPDATE = 17,
	PROPOSAL_DELETE = 18,
	COMMITTEE_MEMBER_CREATE = 19,
	COMMITTEE_MEMBER_UPDATE = 20,
	COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS = 21,
	COMMITTEE_MEMBER_ACTIVATE = 22,
	COMMITTEE_MEMBER_DEACTIVATE = 23,
	COMMITTEE_FROZEN_BALANCE_DEPOSIT = 24,
	COMMITTEE_FROZEN_BALANCE_WITHDRAW = 25,
	VESTING_BALANCE_CREATE = 26,
	VESTING_BALANCE_WITHDRAW = 27,
	BALANCE_CLAIM = 28,
	BALANCE_FREEZE = 29,
	BALANCE_UNFREEZE = 30,
	CONTRACT_CREATE = 31,
	CONTRACT_CALL = 32,
	CONTRACT_INTERNAL_CREATE = 33, // VIRTUAL
	CONTRACT_INTERNAL_CALL = 34, // VIRTUAL
	CONTRACT_SELFDESTRUCT = 35, // VIRTUAL
	CONTRACT_UPDATE = 36,
	CONTRACT_FUND_POOL = 37,
	CONTRACT_WHITELIST = 38,
	SIDECHAIN_ETH_CREATE_ADDRESS = 39,
	SIDECHAIN_ETH_APPROVE_ADDRESS = 40,
	SIDECHAIN_ETH_DEPOSIT = 41,
	SIDECHAIN_ETH_SEND_DEPOSIT = 42,
	SIDECHAIN_ETH_WITHDRAW = 43,
	SIDECHAIN_ETH_SEND_WITHDRAW = 44,
	SIDECHAIN_ETH_APPROVE_WITHDRAW = 45,
	SIDECHAIN_ETH_UPDATE_CONTRACT_ADDRESS = 46,
	SIDECHAIN_ISSUE = 47, // VIRTUAL
	SIDECHAIN_BURN = 48, // VIRTUAL
	SIDECHAIN_ERC20_REGISTER_TOKEN = 49,
	SIDECHAIN_ERC20_DEPOSIT_TOKEN = 50,
	SIDECHAIN_ERC20_SEND_DEPOSIT_TOKEN = 51,
	SIDECHAIN_ERC20_WITHDRAW_TOKEN = 52,
	SIDECHAIN_ERC20_SEND_WITHDRAW_TOKEN = 53,
	SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW = 54,
	SIDECHAIN_ERC20_ISSUE = 55, // VIRTUAL
	SIDECHAIN_ERC20_BURN = 56, // VIRTUAL
	SIDECHAIN_BTC_CREATE_ADDRESS = 57,
	SIDECHAIN_BTC_CREATE_INTERMEDIATE_DEPOSIT = 58,
	SIDECHAIN_BTC_INTERMEDIATE_DEPOSIT = 59,
	SIDECHAIN_BTC_DEPOSIT = 60,
	SIDECHAIN_BTC_WITHDRAW = 61,
	SIDECHAIN_BTC_AGGREGATE = 62,
	SIDECHAIN_BTC_APPROVE_AGGREGATE = 63,
	BLOCK_REWARD = 64, // VIRTUAL
	EVM_ADDRESS_REGISTER = 65,
	DID_CREATE_OPERATION = 66,
	DID_UPDATE_OPERATION = 67,
	DID_DELETE_OPERATION = 68,
}
