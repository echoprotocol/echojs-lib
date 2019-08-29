import ObjectIdSerializer from './ObjectId';
import { RESERVED_SPACES } from '../../../constants/chain-types';
import { OBJECT_TYPES } from '../../../constants';

export const accountId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.ACCOUNT);
export const assetId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.ASSET);
export const committeeMemberId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.COMMITTEE_MEMBER);
export const proposalId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.PROPOSAL);
export const vestingBalanceId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.VESTING_BALANCE);
export const balanceId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.BALANCE);
export const contractId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.CONTRACT);
export const depositEthId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.SIDECHAIN_ETH_DEPOSIT);
export const withdrawEthId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.SIDECHAIN_ETH_WITHDRAW);
