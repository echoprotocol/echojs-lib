import { Int64Serializer } from "../basic/integers";
import { StructSerializer } from "../collections";
import { assetId } from "./id/protocol";

declare const assetSerializer: StructSerializer<{
	amount: Int64Serializer,
	asset_id: typeof assetId,
}>;
export default assetSerializer;
