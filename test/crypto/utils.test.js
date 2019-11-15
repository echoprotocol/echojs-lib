import { strictEqual, throws } from 'assert';
import { utils, PrivateKey, ED25519 } from '../../src/crypto';
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

			const expectedBuffer = '453ac952107e6279d3b31e8e257e010eaf3a36cf17e0a7a3cd24c02c7cbdd6afc155f71d20d4b5d2baef1db0ae9556db7d39ad4e1d0971a3fabcda337ddb7104';
			const result = utils.signData(buffer, [privateKey1]);

			strictEqual(expectedBuffer, result.toString('hex'));

		});

		it('should return the concatenated result with two PrivateKeys', async () => {

			const expectedBuffer = '453ac952107e6279d3b31e8e257e010eaf3a36cf17e0a7a3cd24c02c7cbdd6afc155f71d20d4b5d2baef1db0ae9556db7d39ad4e1d0971a3fabcda337ddb7104f41b7a26625a8578ba711cb9ae6956810206acc713d59f35ee751548ee6eab747c6d0d3df9790aece33412da18cd42176a9f0d3e5be3beae23477706db72cd0c';
			const result = utils.signData(buffer, [privateKey1, privateKey2]);

			strictEqual(expectedBuffer, result.toString('hex'));

		});

	});

});
