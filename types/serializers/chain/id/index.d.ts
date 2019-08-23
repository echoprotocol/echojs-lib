import ObjectIdSerializer, { ObjectTypeId } from "./ObjectId";
import { RESERVED_SPACES } from "../../../constants/chain-types";

export { default as accountId } from "./account_id";
export { default as assetId } from "./asset_id";

export function objectId<T extends RESERVED_SPACES>(
	reservedSpaceId: T,
	objectsIdsTypes: ObjectTypeId<T> | ObjectTypeId<T>[],
): ObjectIdSerializer<T>;

export { ObjectIdSerializer };
