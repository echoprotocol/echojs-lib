import { StructSerializer } from "../collections";
import { asset, extensions, publicKey } from "../chain";
import { accountId, balanceId } from "../chain/id/protocol";
import { transferOperationPropsSerializer } from "../protocol/transfer";
import {
	accountCreateOperationPropsSerializer,
	accountUpdateOperationPropsSerializer,
	accountWhitelistOperationPropsSerializer,
} from "../protocol/account";

export declare const transfer: typeof transferOperationPropsSerializer;
export declare const accountCreate: typeof accountCreateOperationPropsSerializer;
export declare const accountUpdate: typeof accountUpdateOperationPropsSerializer;
export declare const accountWhitelist: typeof accountWhitelistOperationPropsSerializer;
