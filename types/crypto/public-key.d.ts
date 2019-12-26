import * as ByteBuffer from "bytebuffer";

export default class PublicKey {
	toString(addressPrefix?: string): string;
	static fromPublicKeyString(publicKey: string, addressPrefix?: string): PublicKey|null;
	static fromBinary(bin: string): PublicKey;
	static fromBuffer(buffer: Buffer): PublicKey;
	toBuffer(): Buffer;
	toBlockchainAddress(): string;
	toPublicKeyString(addressPrefix?: string): string;
	fromPublicKeyString(publicKey: string, addressPrefix?: string): PublicKey|null;
	fromStringOrThrow(publicKey: string, addressPrefix?: string): PublicKey;
	toByteBuffer(): ByteBuffer;
	static fromHex(hex: string): PublicKey;
	toHex(): string;
	static fromPublicKeyStringHex(hex: string): PublicKey;
}
