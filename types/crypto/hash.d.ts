export function sha1(data: string | Buffer, encoding: string): string | Buffer;
export function sha256(data: string | Buffer, encoding: string): string | Buffer;
export function sha512(data: string | Buffer, encoding: string): string | Buffer;
export function HmacSHA256(data: Buffer, secret: Buffer): string | Buffer;
export function ripemd160(data: Buffer): string | Buffer;
