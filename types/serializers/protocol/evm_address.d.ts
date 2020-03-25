import { StructSerializer } from "../collections";
import { asset, extensions } from "../chain";
import { accountId } from "../chain/id/protocol";
import ethAddress from "./ethAddress";

export declare const evmAddressRegisterOperationPropsSerializer: StructSerializer<{
    fee: typeof asset,
    owner: typeof accountId,
    evm_address: typeof ethAddress,
    extensions: typeof extensions,
}>;
