import ObjectIdSerializer from './ObjectId';
import { RESERVED_SPACE_ID } from '../../../constants/chain-types';
import { PROTOCOL_OBJECT_TYPE_ID } from '../../../constants';

export const accountId = new ObjectIdSerializer(RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.ACCOUNT);
export const assetId = new ObjectIdSerializer(RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.ASSET);
export const committeeMemberId = new ObjectIdSerializer(
	RESERVED_SPACE_ID.PROTOCOL,
	PROTOCOL_OBJECT_TYPE_ID.COMMITTEE_MEMBER,
);
export const proposalId = new ObjectIdSerializer(RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.PROPOSAL);
export const operationHistoryId = new ObjectIdSerializer(
	RESERVED_SPACE_ID.PROTOCOL,
	PROTOCOL_OBJECT_TYPE_ID.OPERATION_HISTORY,
);
export const vestingBalanceId = new ObjectIdSerializer(
	RESERVED_SPACE_ID.PROTOCOL,
	PROTOCOL_OBJECT_TYPE_ID.VESTING_BALANCE,
);
export const balanceId = new ObjectIdSerializer(RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.BALANCE);
export const frozenBalanceId = new ObjectIdSerializer(
	RESERVED_SPACE_ID.PROTOCOL,
	PROTOCOL_OBJECT_TYPE_ID.FROZEN_BALANCE,
);
export const contractId = new ObjectIdSerializer(RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.CONTRACT);
export const ethDepositId = new ObjectIdSerializer(
	RESERVED_SPACE_ID.PROTOCOL,
	PROTOCOL_OBJECT_TYPE_ID.SIDECHAIN_ETH_DEPOSIT,
);
export const ethWithdrawId = new ObjectIdSerializer(
	RESERVED_SPACE_ID.PROTOCOL,
	PROTOCOL_OBJECT_TYPE_ID.SIDECHAIN_ETH_WITHDRAW,
);
export const erc20TokenId = new ObjectIdSerializer(RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.ERC20_TOKEN);
export const depositErc20TokenId = new ObjectIdSerializer(
	RESERVED_SPACE_ID.PROTOCOL,
	PROTOCOL_OBJECT_TYPE_ID.ERC20_DEPOSIT_TOKEN,
);
export const withdrawErc20TokenId = new ObjectIdSerializer(
	RESERVED_SPACE_ID.PROTOCOL,
	PROTOCOL_OBJECT_TYPE_ID.ERC20_WITHDRAW_TOKEN,
);
export const btcAddressId = new ObjectIdSerializer(RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.BTC_ADDRESS);
export const btcIntermediateDepositId = new ObjectIdSerializer(
	RESERVED_SPACE_ID.PROTOCOL,
	PROTOCOL_OBJECT_TYPE_ID.BTC_INTERMEDIATE_DEPOSIT,
);
export const btcDepositId = new ObjectIdSerializer(RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.BTC_DEPOSIT);
export const btcWithdrawId = new ObjectIdSerializer(RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.BTC_WITHDRAW);
export const btcAggregatingId = new ObjectIdSerializer(
	RESERVED_SPACE_ID.PROTOCOL,
	PROTOCOL_OBJECT_TYPE_ID.BTC_AGGREGATING,
);
export const btcBlockId = new ObjectIdSerializer(RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.BTC_BLOCK);

export const evmAddressId = new ObjectIdSerializer(RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.EVM_ADDRESS);
export const didObjectId = new ObjectIdSerializer(RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.DID_OBJECT);
