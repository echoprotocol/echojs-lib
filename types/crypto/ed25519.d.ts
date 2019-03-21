export default class ED25519 {
    createKeyPair(): { privateKey:Buffer, publicKey:Buffer };
    keyPairFromPrivateKey(privateKey: string|Buffer): { privateKey:Buffer, publicKey:Buffer };
};
