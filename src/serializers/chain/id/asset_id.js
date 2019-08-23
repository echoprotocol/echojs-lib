import ObjectIdSerializer from './ObjectId';
import { OBJECT_TYPES } from '../../../constants';
import { RESERVED_SPACES } from '../../../constants/chain-types';

const assetIdSerializer = new ObjectIdSerializer(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.ASSET);
export default assetIdSerializer;
