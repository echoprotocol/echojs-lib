import { ok, strictEqual } from 'assert';
import { expect } from 'chai';
import { decodeUnsignedInteger } from '../../../src/contract/decoders';
import bitsCountTests from './_bitsCount.test';
import valueTests from './_value.test';
import BigNumber from 'bignumber.js';

describe('unsigned integer', () => {
	describe('failure', () => {
		it('overflow', () => {
			expect(() => {
				// 2 ** 64
				decodeUnsignedInteger(64, '0000000000000000000000000000000000000000000000010000000000000000');
			}).to.throw(Error, 'uint64 overflow');
		});
		describe('invalid value format', () => {
			for (const { test, value, error } of valueTests) {
				it(test, () => expect(() => decodeUnsignedInteger(64, value)).to.throw(Error, error || test));
			}
		});
		describe('invalid bits count', () => {
			for (const { test, bitsCount } of bitsCountTests) {
				it(test, () => expect(() => decodeUnsignedInteger(bitsCount, 'any')).to.throw(Error, test));
			}
		});
	});
	describe('successful', () => {
		it('uint48', () => {
			const res = decodeUnsignedInteger(48, '0000000000000000000000000000000000000000000000000000b4b793bd3fa4');
			strictEqual(res, 198700550668196);
		});
		it('uint56', () => {
			const res = decodeUnsignedInteger(56, '000000000000000000000000000000000000000000000000002709fd622354e3');
			ok(BigNumber.isBigNumber(res));
			ok(res.eq('10988507969574115'));
		});
		it('uint256', () => {
			const res = decodeUnsignedInteger(256, 'e40b0d52f1ecc1386e58dd5e94bbbf800e4935e7dc1c3acd4340747da5c6cc88');
			ok(BigNumber.isBigNumber(res));
			ok(res.eq('103146856753593091314695200629400608876612601941427288939931740049017026301064'));
		});
	});
});
