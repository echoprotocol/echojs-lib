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
export const depositId = new ObjectIdSerializer(
	RESERVED_SPACE_ID.PROTOCOL,
	PROTOCOL_OBJECT_TYPE_ID.SIDECHAIN_ETH_DEPOSIT,
);
export const withdrawId = new ObjectIdSerializer(
	RESERVED_SPACE_ID.PROTOCOL,
	PROTOCOL_OBJECT_TYPE_ID.SIDECHAIN_ETH_WITHDRAW,
);
export const erc20TokenId = new ObjectIdSerializer(RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.ERC20_TOKEN);
export const btcAddressId = new ObjectIdSerializer(RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.BTC_ADDRESS);
export const btcIntermediateDepositId = new ObjectIdSerializer(
	RESERVED_SPACE_ID.PROTOCOL,
	PROTOCOL_OBJECT_TYPE_ID.BTC_INTERMEDIATE_DEPOSIT,
);
