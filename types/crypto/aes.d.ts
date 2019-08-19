import { AES } from 'crypto-js';
import { Buffer } from "buffer";
import PrivateKey from "./private-key";
import PublicKey from "./public-key";

export default class Aes {
	constructor(iv:Buffer, key:Buffer);
	clear(): void;
	static fromSeed(seed: string): typeof AES;
	static fromSha512(hash: string): typeof AES;
	static fromBuffer(buf: Buffer): typeof AES;
	static decryptWithChecksum(privateKey: PrivateKey, publicKey: PublicKey, nonce: string, message: string|Buffer, legacy: boolean): Buffer;
	static encryptWithChecksum(privateKey: PrivateKey, publicKey: PublicKey, nonce: string, message: string|Buffer): Buffer;
	decrypt(ciphertext: string): Buffer;
	encrypt(plaintext: string): Buffer;
	encryptToHex(plaintext: string|Buffer): string;
	decryptHex(cipher: string): string;
	decryptHexToBuffer(cipher: string): Buffer;
	decryptHexToText(cipher: string, encoding: string): string;
	encryptHex(plainhex: string): string;
}
