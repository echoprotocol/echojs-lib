import ObjectIdSerializer from "./ObjectId";
import { RESERVED_SPACES } from "../../../constants/chain-types";

export declare const accountId: ObjectIdSerializer<RESERVED_SPACES.PROTOCOL_IDS>;
export declare const assetId: ObjectIdSerializer<RESERVED_SPACES.PROTOCOL_IDS>;
export declare const committeeMemberId: ObjectIdSerializer<RESERVED_SPACES.PROTOCOL_IDS>;
export declare const proposalId: ObjectIdSerializer<RESERVED_SPACES.PROTOCOL_IDS>;
export declare const vestingBalanceId: ObjectIdSerializer<RESERVED_SPACES.PROTOCOL_IDS>;
export declare const balanceId: ObjectIdSerializer<RESERVED_SPACES.PROTOCOL_IDS>;
export declare const contractId: ObjectIdSerializer<RESERVED_SPACES.PROTOCOL_IDS>;
export declare const depositEthId: ObjectIdSerializer<RESERVED_SPACES.PROTOCOL_IDS>;
export declare const withdrawEthId: ObjectIdSerializer<RESERVED_SPACES.PROTOCOL_IDS>;
export declare const erc20TokenId: ObjectIdSerializer<RESERVED_SPACES.PROTOCOL_IDS>;