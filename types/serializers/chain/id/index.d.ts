import AnyObjectIdSerializer from './AnyObjectId';
import ObjectIdSerializer, { ObjectTypeId } from "./ObjectId";
import * as protocol from "./protocol";
import { RESERVED_SPACE_ID } from "../../../constants/chain-types";

export { default as blockId } from './BlockId';
export declare const anyObjectId: AnyObjectIdSerializer;

export function objectId<T extends RESERVED_SPACE_ID>(
	reservedSpaceId: T,
	objectsIdsTypes: ObjectTypeId<T> | ObjectTypeId<T>[],
): ObjectIdSerializer<T>;

export { protocol, ObjectIdSerializer, AnyObjectIdSerializer };
