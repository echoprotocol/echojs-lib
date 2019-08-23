import ObjectIdSerializer from "./ObjectId";
import { RESERVED_SPACES } from "../../../constants/chain-types";

export default class AssetIdSerializer extends ObjectIdSerializer<RESERVED_SPACES.PROTOCOL_IDS> {
}
