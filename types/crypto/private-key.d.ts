import PublicKey from "./public-key";

export default class PrivateKey {
	static fromWif(wif: string): PrivateKey;
	static fromSeed(seed: string): PrivateKey;
	toBuffer(): Buffer;
	toWif(): string;
	toPublicKey(): PublicKey;
}
