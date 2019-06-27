export default class PublicKey {
	toString(addressPrefix?: string): string;
	static fromPublicKeyString(publicKey: string, addressPrefix?: string): PublicKey | null;
	static fromBinary(bin: String): PublicKey;
	static fromBuffer(buffer: Buffer): PublicKey;
	toBuffer(): Buffer;
	toBlockchainAddress(): String;
	toPublicKeyString(addressPrefix?: String): String;
	fromPublicKeyString(publicKey: String, addressPrefix?: String): PublicKey|null;
	toByteBuffer(): ByteBuffer;
	static fromHex(hex: String): PublicKey;
	toHex(): String;
	static fromPublicKeyStringHex(hex: String): PublicKey;
};
