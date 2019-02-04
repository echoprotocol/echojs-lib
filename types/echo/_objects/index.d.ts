import {
	RESERVED_SPACE,
	RELATIVE_PROTOCOL_OBJECT,
	PROTOCOL_OBJECT,
	IMPLEMENTATION_OBJECT,
} from "../../constants/chain-types";
import RelativeProtocolObject from "./relative-protocol-object";
import ProtocolObject from "./protocol-object";
import ImplementationObject from "./implementation-object";

export type OBJECT_TYPE = {
	[RESERVED_SPACE.RELATIVE_PROTOCOL]: RELATIVE_PROTOCOL_OBJECT,
	[RESERVED_SPACE.PROTOCOL]: PROTOCOL_OBJECT,
	[RESERVED_SPACE.IMPLEMENTATION]: IMPLEMENTATION_OBJECT,
}

export type OBJECT = {
	[RESERVED_SPACE.RELATIVE_PROTOCOL]: RelativeProtocolObject,
	[RESERVED_SPACE.PROTOCOL]: ProtocolObject,
	[RESERVED_SPACE.IMPLEMENTATION]: ImplementationObject,
}
