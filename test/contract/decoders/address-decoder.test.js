import 'mocha';
import { strictEqual } from 'assert';
import { expect } from 'chai';
import decode, { decodeAddress } from '../../../src/contract/decoders';
import valueTests from './_value.test';
import { PROTOCOL_OBJECT_TYPE_ID } from '../../../src/constants';

describe('address', () => {
	describe('failure', () => {
		describe('invalid value format', () => {
			for (const { test, value, error } of valueTests) {
				it(test, () => expect(() => decodeAddress(value)).to.throw(Error, error || test));
			}
		});
		for (const { test, value } of [
			{
				test: 'first 100 bits are not zeros',
				value: '0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
			},
			{
				test: '13th byte is not in ["00", "01"]',
				value: '000000000000000000000000020123456789abcdeffedcba9876543210012345',
			},
		]) it(test, () => expect(() => decodeAddress(value)).to.throw(Error, test));
		it('by default decoder', () => {
			for (const { test, value } of [
				{
					test: 'first 100 bits are not zeros',
					value: '0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
				},
				{
					test: '13th byte is not in ["00", "01"]',
					value: '000000000000000000000000020123456789abcdeffedcba9876543210012345',
				},
			]) expect(() => decode(value, ['address'])).to.throw(Error, test);
		});
	});
	describe('successful', () => {
		it('account', () => {
			strictEqual(decodeAddress('000000000000000000000000000000000000000000000000000000000000dead'), '1.2.57005');
		});
		it('contract', () => {
			const address = decodeAddress('000000000000000000000000010000000000000000000000000000000000dead');
			strictEqual(address, `1.${PROTOCOL_OBJECT_TYPE_ID.CONTRACT}.57005`);
		});
		it('by default decoder', () => {
			const account = decode('000000000000000000000000000000000000000000000000000000000000dead', ['address']);
			strictEqual(account, '1.2.57005');
			const contract = decode('000000000000000000000000010000000000000000000000000000000000dead', ['address']);
			strictEqual(contract, `1.${PROTOCOL_OBJECT_TYPE_ID.CONTRACT}.57005`);
		});
	});
});
