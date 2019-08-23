import { assetId } from "./id";
import { Int64Serializer } from "../basic/integers";
import { StructSerializer } from "../collections";

declare const assetSerializer: StructSerializer<{
	amount: Int64Serializer,
	asset_id: typeof assetId,
}>;
export default assetSerializer;
