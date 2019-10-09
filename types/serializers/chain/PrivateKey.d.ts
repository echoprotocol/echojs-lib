import ISerializer from "../ISerializer";
import PrivateKey from "../../crypto/private-key";

type TInput = PrivateKey | string;
type TOutput = string;

export default class PrivateKeySerializer extends ISerializer<TInput, TOutput> {
    toRaw(value: TInput): TOutput;
    appendToByteBuffer(): void;
    readFromBuffer(buffer: Buffer, offset?: number): { res: string; newOffset: number };
}
