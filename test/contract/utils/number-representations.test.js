import 'mocha';
import { ok } from 'assert';
import BigNumber from 'bignumber.js';
import { expect } from 'chai';
import {
	fromDirectRepresentation, fromOnesComplementRepresentation, fromTwosComplementRepresentation,
	toDirectRepresentation,
	toOnesComplementRepresentation,
	toTwosComplementRepresentation,
} from '../../../src/contract/utils/number-representations';
import { toTwosPower } from '../../../src/contract/utils/converters';

describe('number representations', () => {
	describe('converters', () => {
		describe('direct representation', () => {
			for (const { test, bitsCount, error } of [
				{ test: 'bits count is not a safe integer', bitsCount: Number.MAX_SAFE_INTEGER * 2 },
				{ test: 'bits count is negative', bitsCount: -12, error: 'bits count is not positive' },
				{ test: 'bits count is equals to zero', bitsCount: -12, error: 'bits count is not positive' },
			]) {it(test, () => {
				expect(() => toDirectRepresentation(123, bitsCount)).to.throw(Error, error || test);
			});}
			it('overflow', () => {
				const value = toTwosPower(8).plus(123);
				expect(() => toDirectRepresentation(value, 8)).to.throw(Error, 'int8 overflow');
			});
			it('positive', () => ok(toDirectRepresentation(9, 8).eq(new BigNumber('00001001', 2))));
			it('negative', () => ok(toDirectRepresentation(-9, 8).eq(new BigNumber('10001001', 2))));
			it('value is BigNumber', () => {
				ok(toDirectRepresentation(new BigNumber(13), 8).eq(new BigNumber('00001101', 2)));
			});
		});

		describe('one\'s complement representation', () => {
			it('positive', () => ok(toOnesComplementRepresentation(9, 8).eq(new BigNumber('00001001', 2))));
			it('negative', () => ok(toOnesComplementRepresentation(-9, 8).eq(new BigNumber('11110110', 2))));
			it('value is BigNumber', () => {
				ok(toOnesComplementRepresentation(new BigNumber(13), 8).eq(new BigNumber('00001101', 2)));
			});
		});

		describe('two\'s complement representation', () => {
			it('positive', () => ok(toTwosComplementRepresentation(9, 8).eq(new BigNumber('00001001', 2))));
			it('negative', () => ok(toTwosComplementRepresentation(-9, 8).eq(new BigNumber('11110111', 2))));
			it('value is BigNumber', () => {
				ok(toTwosComplementRepresentation(new BigNumber(13), 8).eq(new BigNumber('00001101', 2)));
			});
		});
	});

	describe('parsers', () => {
		const failureTests = [
			{
				test: 'bits count is not a number',
				bitsCount: 'not_a_number',
				error: 'bits count is not a safe integer',
			},
			{ test: 'bits count is not integer', bitsCount: 1.23, error: 'bits count is not a safe integer' },
			{
				test: 'bits count is gte UINT53_MAX_VALUE',
				bitsCount: Number.MAX_SAFE_INTEGER + 123,
				error: 'bits count is not a safe integer',
			},
			{ test: 'bits count is negative', bitsCount: -123, error: 'bits count is not positive' },
			{ test: 'bits count is equals to zero', bitsCount: 0, error: 'bits count is not positive' },
			{ test: 'overflow', bitsCount: 4, error: '4-bit representation overflow' },
		];
		describe('direct representation', () => {
			for (const { test, bitsCount, error } of failureTests) {
				it(test, () => {
					expect(() => fromDirectRepresentation(new BigNumber(123), bitsCount)).to.throw(Error, error);
				});
			}
			it('negative representation', () => {
				expect(() => {
					fromDirectRepresentation(new BigNumber(-123), 8);
				}).to.throw(Error, 'representation is negative');
			});
			it('representation is not BigNumber', () => {
				expect(() => {
					// noinspection JSCheckFunctionSignatures
					fromDirectRepresentation('not_a_BigNumber', 8);
				}).to.throw(Error, 'representation is not a BigNumber');
			});
			it('positive', () => ok(fromDirectRepresentation(new BigNumber('00001001', 2), 8).eq(9)));
			it('negative', () => ok(fromDirectRepresentation(new BigNumber('10001001', 2), 8).eq(-9)));
		});

		describe('one\'s complement representation', () => {
			for (const { test, bitsCount, error } of failureTests) {
				it(test, () => {
					expect(() => {
						fromOnesComplementRepresentation(new BigNumber(123), bitsCount);
					}).to.throw(Error, error);
				});
			}
			it('negative representation', () => {
				expect(() => {
					fromOnesComplementRepresentation(new BigNumber(-123), 8);
				}).to.throw(Error, 'representation is negative');
			});
			it('positive', () => ok(fromOnesComplementRepresentation(new BigNumber('00001001', 2), 8).eq(9)));
			it('negative', () => ok(fromOnesComplementRepresentation(new BigNumber('11110110', 2), 8).eq(-9)));
		});

		describe('one\'s complement representation', () => {
			for (const { test, bitsCount, error } of failureTests) {
				it(test, () => {
					expect(() => {
						fromTwosComplementRepresentation(new BigNumber(123), bitsCount);
					}).to.throw(Error, error);
				});
			}
			it('negative representation', () => {
				expect(() => {
					fromTwosComplementRepresentation(new BigNumber(-123), 8);
				}).to.throw(Error, 'representation is negative');
			});
			it('positive', () => ok(fromTwosComplementRepresentation(new BigNumber('00001001', 2), 8).eq(9)));
			it('negative', () => ok(fromTwosComplementRepresentation(new BigNumber('11110111', 2), 8).eq(-9)));
		});
	});
});
