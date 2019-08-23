import ObjectIdSerializer from './ObjectId';

export { default as accountId } from './account_id';
export { default as assetId } from './asset_id';

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

export { ObjectIdSerializer };
