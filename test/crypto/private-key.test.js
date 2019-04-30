import { strictEqual } from 'assert';
import bs58 from 'bs58'
import ED25519 from '../../src/crypto/ed25519'
import PrivateKey from '../../src/crypto/private-key'

describe('PrivateKey', () => {

	it('Public key from private ', async () => {

		const edPrivate = 'DET5oLTA94JqbUGVskymaykqudd7DM6sjmEjrYvzZjSRsRt';
		const edPrivateWithoutDET = '5oLTA94JqbUGVskymaykqudd7DM6sjmEjrYvzZjSRsRt';
		const edPrivateWithoutDETDecoded = bs58.decode(edPrivateWithoutDET);
		const edPrivateWithoutHex = edPrivateWithoutDETDecoded.toString('hex');
		const res = ED25519.keyPairFromPrivateKey(edPrivateWithoutHex);

		const publicKey = `DET${bs58.encode(res.publicKey)}`;
		const privateKey = `DET${bs58.encode(res.privateKey)}`;
		const prKey = PrivateKey.fromBuffer(res.privateKey);

		strictEqual(publicKey, prKey.toPublicKey().toPublicKeyString());
		strictEqual(edPrivate, privateKey);

	});
});