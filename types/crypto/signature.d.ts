import BigInteger from "bigi";
import PrivateKey from "./private-key";

export default class Signature {
	readonly r: BigInteger;
	readonly s: BigInteger;
	readonly i: number;
	constructor(r: BigInteger, s: BigInteger, i: number);
	static signHash(hash: Buffer, privateKey: PrivateKey): Signature;
	static signBufferSha256(buffer: Buffer, privateKey: PrivateKey): Signature;
	toBuffer(): Buffer;
}
