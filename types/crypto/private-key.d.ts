import PublicKey from "./public-key";

export default class PrivateKey {
	static fromWif(wif: string): PrivateKey;
	toBuffer(): Buffer;
	toPublicKey(): PublicKey;
};
