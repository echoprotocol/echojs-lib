import ObjectIdSerializer from './ObjectId';
import { RESERVED_SPACES } from '../../../constants/chain-types';
import { OBJECT_TYPES } from '../../../constants';

export const accountId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.ACCOUNT);
export const assetId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.ASSET);
export const proposalId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.PROPOSAL);
export const balanceId = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.BALANCE);
