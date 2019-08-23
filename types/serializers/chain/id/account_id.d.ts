import ObjectIdSerializer from "./ObjectId";
import { RESERVED_SPACES } from "../../../constants/chain-types";

declare const accountIdSerializer: ObjectIdSerializer<RESERVED_SPACES.PROTOCOL_IDS>;
export default accountIdSerializer;
