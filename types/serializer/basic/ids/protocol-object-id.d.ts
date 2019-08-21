import { IdType } from "./id";
import PROTOCOL_OBJECT_TYPE_ID from "../../../interfaces/ProtocolObjectTypeId";
import { RESERVED_SPACES } from "../../../constants/chain-types";

export default function protocolObjectId(objectTypeId: PROTOCOL_OBJECT_TYPE_ID): IdType<RESERVED_SPACES.PROTOCOL_IDS>;
