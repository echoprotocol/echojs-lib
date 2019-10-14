import { asset } from "../../chain";
import { accountId } from "../../chain/id/protocol";
import { StructSerializer } from "../../collections";
import { StringSerializer } from "../../basic";

export declare const sidechainBtcCreateAddressOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	backup_address: StringSerializer,
}>;