import ObjectIdSerializer, { ObjectTypeId } from "./ObjectId";
import AssetIdSerializer from "./AssetId";
import { RESERVED_SPACES } from "../../../constants/chain-types";

export function objectId<T extends RESERVED_SPACES>(
	reservedSpaceId: T,
	objectsIdsTypes: ObjectTypeId<T> | ObjectTypeId<T>[],
): ObjectIdSerializer<T>;

export const assetId: AssetIdSerializer;

export { ObjectIdSerializer, AssetIdSerializer };
