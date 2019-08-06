export default class ED25519 {
	createKeyPair(): { privateKey:Buffer, publicKey:Buffer };
	keyPairFromPrivateKey(privateKey: string|Buffer): { privateKey:Buffer, publicKey:Buffer };
	static signMessage(message:Buffer, publicKey:Buffer, privateKey:Buffer): { signature:Buffer };
	static verifyMessage(signature:Buffer, message:Buffer, publicKey:Buffer): Boolean;
}
