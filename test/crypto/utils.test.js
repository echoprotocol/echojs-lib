import { strictEqual, throws } from 'assert';
import { utils, PrivateKey } from '../../src/crypto';
import { WIF, WIF2 } from '../_test-data';

describe('Utils', () => {

	describe('when we call signData', () => {

		const privateKey1 = PrivateKey.fromWif(WIF);
		const privateKey2 = PrivateKey.fromWif(WIF2);
		const buffer = Buffer.from('test', 'utf-8');

		it('should throw an error when a first argument is wrong.', async () => {
			throws(() => utils.signData('string', [privateKey1, privateKey2]), /invalid data type/);
		});

		it('should throw an error when a second argument is wrong.', async () => {
			throws(() => utils.signData(Buffer.from('tst'), 'test'), /Private Keys field is not an array/);
		});

		it('should throw an error when an array of private keys is empty.', async () => {
			throws(() => utils.signData(Buffer.from('tst'), []), /Private Keys length should be more than 0/);
		});

		it('should throw an error when one of the elements in an array is not PrivateKey', async () => {
			throws(() => utils.signData(Buffer.from('tst'), ['test']), /one of the elements in an array is not PrivateKey/);
		});

		it('should return the expected result with one PrivateKey', async () => {

			const expectedBuffer = '17e1ba550622dadaad4a16dd486c8a7fa1c9a90f3a11290dcf7f897777899807ea162f135355c4b229938f0991e9008e0ed0c15d75ce3b75f3c4b2e0b144de05';
			const result = utils.signData(buffer, [privateKey1]);

			strictEqual(expectedBuffer, result.toString('hex'));

		});

		it('should return the concatenated result with two PrivateKeys', async () => {

			const expectedBuffer = '17e1ba550622dadaad4a16dd486c8a7fa1c9a90f3a11290dcf7f897777899807ea162f135355c4b229938f0991e9008e0ed0c15d75ce3b75f3c4b2e0b144de058b049d0c424f2214ffb13a4651ff8437bbcd9a58d9100533da11bf6133b7a16f226d9955cb3bea8752d085f639c215dc20095230072a06377adc53c471c8a605';
			const result = utils.signData(buffer, [privateKey1, privateKey2]);

			strictEqual(expectedBuffer, result.toString('hex'));

		});

	});

});
