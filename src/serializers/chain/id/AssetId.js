import ObjectIdSerializer from './ObjectId';
import { OBJECT_TYPES } from '../../../constants';
import { RESERVED_SPACES } from '../../../constants/chain-types';

/**
 * @augments {ObjectIdSerializer<typeof RESERVED_SPACES['PROTOCOL_IDS']>}
 */
export default class AssetIdSerializer extends ObjectIdSerializer {

	constructor() {
		super(RESERVED_SPACES.PROTOCOL_IDS, OBJECT_TYPES.ASSET);
	}

}
