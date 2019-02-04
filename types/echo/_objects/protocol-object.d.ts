import { PROTOCOL_OBJECT } from "../../constants/chain-types";

type ProtocolObject = {
	[PROTOCOL_OBJECT.NULL]: void,
	[PROTOCOL_OBJECT.BASE]: void,
	[PROTOCOL_OBJECT.ACCOUNT]: void,
	[PROTOCOL_OBJECT.ASSET]: void,
	[PROTOCOL_OBJECT.FORCE_SETTLEMENT]: void,
	[PROTOCOL_OBJECT.COMMITTEE_MEMBER]: void,
	[PROTOCOL_OBJECT.WITNESS]: void,
	[PROTOCOL_OBJECT.LIMIT_ORDER]: void,
	[PROTOCOL_OBJECT.CALL_ORDER]: void,
	[PROTOCOL_OBJECT.CUSTOM]: void,
	[PROTOCOL_OBJECT.PROPOSAL]: void,
	[PROTOCOL_OBJECT.OPERATION_HISTORY]: void,
	[PROTOCOL_OBJECT.WITHDRAW_PERMISSION]: void,
	[PROTOCOL_OBJECT.VESTING_BALANCE]: void,
	[PROTOCOL_OBJECT.WORKER]: void,
	[PROTOCOL_OBJECT.BALANCE]: void,
	[PROTOCOL_OBJECT.CONTRACT]: void,
	[PROTOCOL_OBJECT.CONTRACT_RESULT]: {
		id: string,
		contracts_id: Array<string>,
	},
}

export default ProtocolObject;
