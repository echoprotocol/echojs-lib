import id from './id';
import { RESERVED_SPACE_ID } from '../../constants/chain-types';

/**
 * @param {number|Array<number>} objectTypeId
 * @returns {IdType}
 */
export default (objectTypeId) => id(RESERVED_SPACE_ID.PROTOCOL, objectTypeId);
