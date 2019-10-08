import 'mocha';
import { ok, strictEqual } from 'assert';
import { expect } from 'chai';
import decode from '../../../src/contract/decoders';
import BigNumber from 'bignumber.js';

describe('dynamic bytes', () => {
	describe('failure', () => {
		it('non-zero bytes in code after full dynamic bytes', () => {
			const code = [
				'0000000000000000000000000000000000000000000000000000000000000020', // offset to next chunk
				'0000000000000000000000000000000000000000000000000000000000000034', // 0x34=52 - bytes count
				// 52 bytes of info and 12 bytes of NON-zeros
				'0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
				'0123456789abcdeffedcba987654321001234567123456789abcdef123456789',
			].join('');
			const func = () => decode(code, ['bytes']);
			expect(func).to.throw(Error, 'non-zero bytes in code after full dynamic bytes');
		});
		it('invalid offset', () => {
			const op = () => decode('000000000000000000000000000000000000000000000000000000000000dead', ['bytes']);
			expect(op).to.throw(Error, 'invalid offset');
		});
	});
	describe('successful', () => {
		it('length is lt 32 bytes', () => {
			const code = [
				'0000000000000000000000000000000000000000000000000000000000000020', // offset to next chunk
				'0000000000000000000000000000000000000000000000000000000000000014', // 0x14=20 - bytes count
				// 20 bytes of info and 12 bytes of zeros
				'0123456789abcdeffedcba987654321001234567000000000000000000000000',
			].join('');
			/** @type Buffer */
			const res = decode(code, ['bytes']);
			ok(Buffer.isBuffer(res), 'result is not a buffer');
			strictEqual(res.toString('hex'), '0123456789abcdeffedcba987654321001234567');
		});
		it('length is gt 32 bytes', () => {
			const code = [
				'0000000000000000000000000000000000000000000000000000000000000020', // offset to next chunk
				'0000000000000000000000000000000000000000000000000000000000000034', // 0x34=52 - bytes count
				// 52 bytes of info and 12 bytes of zeros
				'0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
				'0123456789abcdeffedcba987654321001234567000000000000000000000000',
			].join('');
			/** @type Buffer */
			const res = decode(code, ['bytes']);
			ok(Buffer.isBuffer(res), 'result is not a buffer');
			const expectedResult = [
				'0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
				'0123456789abcdeffedcba987654321001234567',
			].join('');
			strictEqual(res.toString('hex'), expectedResult);
		});
		it('with bytes count divided by 32', () => {
			const expectedResult = '0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210';
			const code = [
				'0000000000000000000000000000000000000000000000000000000000000020', // offset to next chunk
				'0000000000000000000000000000000000000000000000000000000000000020', // 0x20=32 - bytes count
				expectedResult, // 32 bytes of info
			].join('');
			/** @type Buffer */
			const res = decode(code, ['bytes']);
			ok(Buffer.isBuffer(res), 'result is not a buffer');
			strictEqual(res.toString('hex'), expectedResult);
		});
		it('with other arguments', () => {
			const _3rdArgumentHex = '66b30729d7e5ed3b58fe0ae6bad07d059777968cd3400cd5e166e5c2a3083746';
			const code = [
				'78b1c7869522f20676c4051b09d95d064ebe563ab5e3e0ee5b9f274b81810b66', // 1st argument
				'0000000000000000000000000000000000000000000000000000000000000060', // offset to 4th chunk
				_3rdArgumentHex, // 2nd argument
				'0000000000000000000000000000000000000000000000000000000000000034', // 0x34=52 - bytes count
				// 52 bytes of info and 12 bytes of zeros
				'0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
				'0123456789abcdeffedcba987654321001234567000000000000000000000000',
			].join('');
			const res = decode(code, ['uint256', 'bytes', 'bytes32']);
			/** @type BigNumber */
			const _1stArgument = res[0];
			/** @type Buffer */
			const _2ndArgument = res[1];
			/** @type Buffer */
			const _3rdArgument = res[2];
			ok(BigNumber.isBigNumber(_1stArgument));
			ok(_1stArgument.eq('54591650836319512518448273601334710849797045650972273334997092380924339882854'));
			ok(Buffer.isBuffer(_2ndArgument));
			const expectedResult = [
				'0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
				'0123456789abcdeffedcba987654321001234567',
			].join('');
			strictEqual(_2ndArgument.toString('hex'), expectedResult);
			ok(Buffer.isBuffer(_3rdArgument));
			strictEqual(_3rdArgument.toString('hex'), _3rdArgumentHex);
		});
	});
});
