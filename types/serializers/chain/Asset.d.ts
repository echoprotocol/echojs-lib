import { StructSerializer } from "../collections";
import { Int64Serializer } from "../basic/integers";
import { AssetIdSerializer } from "./id";

type SerializerStruct = {
	amount: Int64Serializer,
	asset_id: AssetIdSerializer,
}

export default class AssetSerializer extends StructSerializer<SerializerStruct> {
}
