import PublicKey from "./public-key";

export default class PrivateKey {
	static fromWif(wif: string): PrivateKey;
	toPublicKey(): PublicKey;
	static fromBuffer(buf: Buffer): PrivateKey;
	static fromSeed(seed: String): PrivateKey;
	static fromWif(_privateWIF: String): PrivateKey;
	toWif(): String;
	toPublicKey(): PublicKey;
	toBuffer(): Buffer;
	getSharedSecret(): Buffer;
	static fromHex(hex: String): PrivateKey;
	toHex(): String;
	toPrivateKeyString(): String;
	static fromPrivateKeyString(privateKeyString: String): PrivateKey|null;
}
