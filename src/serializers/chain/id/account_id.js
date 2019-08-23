import ObjectIdSerializer from './ObjectId';
import { OBJECT_TYPES } from '../../../constants';
import { RESERVED_SPACES } from '../../../constants/chain-types';

const accountIdSerializer = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.ACCOUNT);
export default accountIdSerializer;
