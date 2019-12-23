import PublicKey from "./public-key";

export default class PrivateKey {
	static fromWif(wif: string): PrivateKey;
	toPublicKey(): PublicKey;
	static fromBuffer(buf: Buffer): PrivateKey;
	static fromSeed(seed: string): PrivateKey;
	static fromWif(_privateWIF: string): PrivateKey;
	toWif(): string;
	toPublicKey(): PublicKey;
	toBuffer(): Buffer;
	getSharedSecret(): Buffer;
	static fromHex(hex: string): PrivateKey;
	toHex(): string;
	toPrivateKeyString(): string;
	static fromPrivateKeyString(privateKeyString: string): PrivateKey|null;
}
