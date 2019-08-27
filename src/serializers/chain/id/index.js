import ObjectIdSerializer from './ObjectId';
import * as protocol from './protocol';

/** @typedef {import("../../../constants/chain-types").e_RESERVED_SPACES} e_RESERVED_SPACES */

/**
 * @template {e_RESERVED_SPACES} T
 * @typedef {import("./ObjectId").ObjectTypeId<T>} ObjectTypeId
 */

/**
 * @template {e_RESERVED_SPACES} T
 * @param {T} reservedSpaceId
 * @param {ObjectTypeId<T> | ObjectTypeId<T>[]} objectsTypesIds
 * @returns {ObjectIdSerializer<T>}
 */
export const objectId = (reservedSpaceId, objectsTypesIds) => new ObjectIdSerializer(reservedSpaceId, objectsTypesIds);

export { protocol, ObjectIdSerializer };
