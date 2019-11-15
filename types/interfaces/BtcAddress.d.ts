import { accountId } from "../serializers/chain/id/protocol";
import { btcPublicKey } from "../serializers/protocol";

export default interface BtcAddress {
    id: string,
    account: string,
    deposit_address: { address: string },
    committee_member_ids_in_script: [typeof accountId["__TOutput__"], typeof btcPublicKey["__TOutput__"]],
    backup_address: string,
    extensions: Array<any>,
}
