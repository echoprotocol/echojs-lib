export default class ED25519 {
    keyPairFromSeed(seed: string|Buffer): { privateKey:Uint8Array, publicKey:Uint8Array };
};
