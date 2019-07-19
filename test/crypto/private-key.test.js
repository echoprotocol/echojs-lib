import { strictEqual, throws } from 'assert';
import bs58 from 'bs58'
import ED25519 from '../../src/crypto/ed25519'
import PrivateKey from '../../src/crypto/private-key'
import { ED_PRIVATE, ED_PRIVATE_WITHOUT_PREFIX, WIF } from '../_test-data'

describe('PrivateKey EdDSA', () => {

	it('Public key from private ', async () => {

		const edPrivateWithoutPrefix = bs58.decode(ED_PRIVATE_WITHOUT_PREFIX);
		const edPrivateWithoutPrefixHex = edPrivateWithoutPrefix.toString('hex');
		const res = ED25519.keyPairFromPrivateKey(edPrivateWithoutPrefixHex);

		const publicKey = `ECHO${bs58.encode(res.publicKey)}`;
		const privateKey = `ECHO${bs58.encode(res.privateKey)}`;
		const prKey = PrivateKey.fromBuffer(res.privateKey);

		strictEqual(publicKey, prKey.toPublicKey().toPublicKeyString());
		strictEqual(ED_PRIVATE, privateKey);

	});

	it('toPrivateKeyString', async () => {

		const edPrivateWithoutPrefix = bs58.decode(ED_PRIVATE_WITHOUT_PREFIX);
		const edPrivateWithoutPrefixHex = edPrivateWithoutPrefix.toString('hex');
		const res = ED25519.keyPairFromPrivateKey(edPrivateWithoutPrefixHex);

		const publicKey = `ECHO${bs58.encode(res.publicKey)}`;
		const privateKey = `ECHO${bs58.encode(res.privateKey)}`;
		const prKey = PrivateKey.fromBuffer(res.privateKey);

		const privateKeyString = prKey.toPrivateKeyString();

		strictEqual(privateKeyString, ED_PRIVATE);

	});

	it('fromPrivateKeyString', async () => {

		const privateKey = PrivateKey.fromPrivateKeyString(ED_PRIVATE);

		strictEqual(privateKey.toWif(), WIF);
		strictEqual(privateKey.toPrivateKeyString(), ED_PRIVATE);
	});


	it('fromPrivateKeyString return null', async () => {

		const privateKey = PrivateKey.fromPrivateKeyString('wrong');

		strictEqual(privateKey, null);

	});


	it('fromPrivateKeyStringOrThrow throw error', async () => {

		throws(
			() => {
				PrivateKey.fromPrivateKeyStringOrThrow('wrong key');
			},
			/Expecting key to begin with/
		);
	});

});
