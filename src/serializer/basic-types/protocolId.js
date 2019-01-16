import id from './id';
import { RESERVED_SPACES } from '../../constants/chain-types';

/**
 * @param {number|Array<number>} objectTypeId
 * @returns {IdType}
 */
export default (objectTypeId) => id(RESERVED_SPACES.PROTOCOL_IDS, objectTypeId);
