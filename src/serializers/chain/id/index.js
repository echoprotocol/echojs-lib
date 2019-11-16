import AnyObjectIdSerializer from './AnyObjectId';
import ObjectIdSerializer from './ObjectId';
import * as protocol from './protocol';

export { default as blockId } from './BlockId';
export const anyObjectId = new AnyObjectIdSerializer();

/** @typedef {import("../../../constants/chain-types").ReservedSpaceId} ReservedSpaceId */

/**
 * @template {ReservedSpaceId} T
 * @typedef {import("./ObjectId").ObjectTypeId<T>} ObjectTypeId
 */

/**
 * @template {ReservedSpaceId} T
 * @param {T} reservedSpaceId
 * @param {ObjectTypeId<T> | ObjectTypeId<T>[]} objectsTypesIds
 * @returns {ObjectIdSerializer<T>}
 */
export const objectId = (reservedSpaceId, objectsTypesIds) => new ObjectIdSerializer(reservedSpaceId, objectsTypesIds);

export { protocol, ObjectIdSerializer, AnyObjectIdSerializer };
