import { expect } from 'chai';
import { encodeInteger, encodeUnsignedInteger } from '../../../src/contract/encoders';

describe('encodeIntegers', () => {
	for (const { test, bitsCount } of [
		{ test: 'bits count is not a number', bitsCount: 'not_a_number' },
		{ test: 'bits count is not a integer', bitsCount: 1.23 },
	]) {it(test, () => {
		expect(() => encodeInteger(bitsCount, 123)).to.throw(Error, test);
		expect(() => encodeUnsignedInteger(bitsCount, 123)).to.throw(Error, test);
	});}
});
