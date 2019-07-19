import { strictEqual } from 'assert';
import PublicKey from '../../src/crypto/public-key';

describe('PublicKey', () => {

	it('fromStringOrThrow', async () => {

		const publicKeyBase = 'ECHOCh3WGJCMKkBJHFJpzaC378cwwYisNbNKpD6oYhcuA6nR';
		const publicKey = PublicKey.fromStringOrThrow('ECHOCh3WGJCMKkBJHFJpzaC378cwwYisNbNKpD6oYhcuA6nR');
		strictEqual(publicKey.toPublicKeyString(), publicKeyBase);

	});

	it('fromPublicKeyString', async () => {

		const publicKeyBase = 'ECHOCh3WGJCMKkBJHFJpzaC378cwwYisNbNKpD6oYhcuA6nR';
		const publicKey = PublicKey.fromPublicKeyString('ECHOCh3WGJCMKkBJHFJpzaC378cwwYisNbNKpD6oYhcuA6nR');
		strictEqual(publicKey.toPublicKeyString(), publicKeyBase);

	});

	it('toHex', async () => {
		const publicKey = PublicKey.fromPublicKeyString('ECHOCh3WGJCMKkBJHFJpzaC378cwwYisNbNKpD6oYhcuA6nR');
		const hex = 'adb29ed6076b83dedcdfdaa9a352c5eaee562031954fe3c977a0bfae9026cb06';
		strictEqual(publicKey.toHex(), hex);

	});

	it('fromHex/toHex', async () => {
		const publicKey = PublicKey.fromPublicKeyString('ECHOCh3WGJCMKkBJHFJpzaC378cwwYisNbNKpD6oYhcuA6nR');
		strictEqual(publicKey.toHex(), PublicKey.fromHex(publicKey.toHex()).toHex());
	});

});
