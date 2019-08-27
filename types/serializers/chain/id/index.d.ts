import ObjectIdSerializer, { ObjectTypeId } from "./ObjectId";
import * as protocol from "./protocol";
import { RESERVED_SPACES } from "../../../constants/chain-types";

export function objectId<T extends RESERVED_SPACES>(
	reservedSpaceId: T,
	objectsIdsTypes: ObjectTypeId<T> | ObjectTypeId<T>[],
): ObjectIdSerializer<T>;

export { protocol, ObjectIdSerializer };
