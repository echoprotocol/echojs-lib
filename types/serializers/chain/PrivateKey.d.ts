import ISerializer from "../ISerializer";
import PrivateKey from "../../crypto/private-key";

type TInput = PrivateKey | string;
type TOutput = string;

export default class PrivateKeySerializer extends ISerializer<TInput, TOutput> {
    toRaw(value: TInput, addressPrefix?: string): TOutput;
    appendToByteBuffer(): void;
}
