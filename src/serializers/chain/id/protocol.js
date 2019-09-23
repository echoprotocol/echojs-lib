import ObjectIdSerializer from './ObjectId';
import { RESERVED_SPACES } from '../../../constants/chain-types';
import { PROTOCOL_OBJECT_TYPE_ID } from '../../../constants';

export const accountId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, PROTOCOL_OBJECT_TYPE_ID.ACCOUNT);
export const assetId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, PROTOCOL_OBJECT_TYPE_ID.ASSET);
export const committeeMemberId = new ObjectIdSerializer(
	RESERVED_SPACES.PROTOCOL_IDS,
	PROTOCOL_OBJECT_TYPE_ID.COMMITTEE_MEMBER,
);
export const proposalId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, PROTOCOL_OBJECT_TYPE_ID.PROPOSAL);
export const vestingBalanceId = new ObjectIdSerializer(
	RESERVED_SPACES.PROTOCOL_IDS,
	PROTOCOL_OBJECT_TYPE_ID.VESTING_BALANCE,
);
export const balanceId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, PROTOCOL_OBJECT_TYPE_ID.BALANCE);
export const contractId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, PROTOCOL_OBJECT_TYPE_ID.CONTRACT);
export const depositEthId = new ObjectIdSerializer(
	RESERVED_SPACES.PROTOCOL_IDS,
	PROTOCOL_OBJECT_TYPE_ID.SIDECHAIN_ETH_DEPOSIT,
);
export const withdrawEthId = new ObjectIdSerializer(
	RESERVED_SPACES.PROTOCOL_IDS,
	PROTOCOL_OBJECT_TYPE_ID.SIDECHAIN_ETH_WITHDRAW,
);
export const erc20TokenId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, PROTOCOL_OBJECT_TYPE_ID.ERC20_TOKEN);
