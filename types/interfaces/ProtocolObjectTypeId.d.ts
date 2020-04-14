declare enum PROTOCOL_OBJECT_TYPE_ID {
	NULL = 0,
	BASE = 1,
	ACCOUNT = 2,
	ASSET = 3,
	COMMITTEE_MEMBER = 4,
	PROPOSAL = 5,
	OPERATION_HISTORY = 6,
	VESTING_BALANCE = 7,
	BALANCE = 8,
	FROZEN_BALANCE = 9,
	COMMITTEE_FROZEN_BALANCE = 10,
	CONTRACT = 11,
	CONTRACT_RESULT = 12,
	ETH_ADDRESS = 13,
	SIDECHAIN_ETH_DEPOSIT = 14,
	SIDECHAIN_ETH_WITHDRAW = 15,
	ERC20_TOKEN = 16,
	ERC20_DEPOSIT_TOKEN = 17,
	ERC20_WITHDRAW_TOKEN = 18,
	BTC_ADDRESS = 19,
	BTC_INTERMEDIATE_DEPOSIT = 20,
	BTC_DEPOSIT = 21,
	BTC_WITHDRAW = 22,
	BTC_AGGREGATING = 23
}

export default PROTOCOL_OBJECT_TYPE_ID;
