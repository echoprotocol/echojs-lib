import BigInteger from 'bigi';
import PrivateKey from './private-key';

export default class Signature {
    readonly r: BigInteger;
    readonly s: BigInteger;
    readonly i: number;
    static signHash(hash: Buffer, privateKey: PrivateKey): Signature;
    static signSha256(buffer: Buffer, privateKey: PrivateKey): Signature;
    toBuffer(): Buffer;
}
