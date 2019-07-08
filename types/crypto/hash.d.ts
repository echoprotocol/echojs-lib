import {Buffer} from 'buffer';

declare function sha1(data: string|Buffer, encoding: string): String|Buffer;
declare function sha256(data: string|Buffer, encoding: string): String|Buffer;
declare function sha512(data: string|Buffer, encoding: string): String|Buffer;
declare function HmacSHA256(data: Buffer, secret: Buffer): String|Buffer;
declare function ripemd160(data: Buffer): String|Buffer;


export default interface Hash {
    sha1(data: string|Buffer, encoding: string): String|Buffer,
    sha256(data: string|Buffer, encoding: string): String|Buffer,
    sha512(data: string|Buffer, encoding: string): String|Buffer,
    HmacSHA256(data: Buffer, secret: Buffer): String|Buffer,
    ripemd160(data: Buffer): String|Buffer,
}
