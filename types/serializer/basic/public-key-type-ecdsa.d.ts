import * as ByteBuffer from "bytebuffer";
import Serializable from "../serializable";
import PublicKey from "../../crypto/public-key";

type TInput = PublicKey | string;

export class PublicKeyTypeECDSA extends Serializable<TInput, string> {
	toRaw(value: TInput): string;
	appendToByteBuffer(value: TInput, bytebuffer: ByteBuffer): void;
}

declare const publicKeyECDSA: PublicKeyTypeECDSA;
export default publicKeyECDSA;
