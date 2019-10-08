import 'mocha';
import { strictEqual } from 'assert';
import BigNumber from 'bignumber.js';
import { expect } from 'chai';
import $c from 'comprehension';
import encode from '../../../src/contract/encoders';
import { toTwosPower } from '../../../src/contract/utils/converters';
import { invalidContractIds as invalidAddressesIds } from '../_checkContractId.test';
import { PROTOCOL_OBJECT_TYPE_ID } from '../../../src/constants';

describe('encode', () => {

	describe('boolean', () => {
		it('not a boolean', () => expect(() => encode({
			type: 'bool',
			value: 'not_a_boolean',
		})).to.throw(Error, 'value is not a boolean'));
		it('false', () => strictEqual(encode({ value: false, type: 'bool' }), $c(64, () => '0').join('')));
		it('true', () => strictEqual(encode({ value: true, type: 'bool' }), `${$c(63, () => '0').join('')}1`));
	});

	describe('integer', () => {
		describe('invalid bits count', () => {
			for (const { test, bitsCount, message } of [
				{ test: 'zero', bitsCount: 0, message: 'bits count is not positive' },
				{ test: 'greater than 256', bitsCount: 257, message: 'bits count is greater than 256' },
				{ test: 'not divisible to 8', bitsCount: 7, message: 'bits count is not divisible to 8' },
			]) {
				it(test, () => {
					for (const type of [`uint${bitsCount}`, `int${bitsCount}`]) {
						expect(() => encode({ value: 123, type })).to.throw(Error, message);
					}
				});
			}
		});
		describe('invalid value', () => {
			for (const { test, value, message } of [{
				test: 'simple number greater than MAX_SAFE_INTEGER',
				value: Number.MAX_SAFE_INTEGER * 2,
				message: 'loss of accuracy, use bignumber.js',
			}, {
				test: 'invalid string',
				value: 'not_a_number',
				message: 'fail to convert string to BigNumber',
			}, {
				test: 'not a number',
				value: Buffer.from('abcdef', 'hex'),
				message: '',
			}, {
				test: 'decimal number',
				value: 1.23,
				message: 'value is not a integer',
			}, {
				test: 'decimal BigNumber',
				value: new BigNumber(1.23),
				message: 'value is not a integer',
			}]) {
				it(test, () => {
					for (const type of ['uint256', 'int256']) {
						expect(() => encode({ value, type })).to.throw(Error, message);
					}
				});
			}
		});
		describe('unsigned', () => {
			it('negative value', () => expect(() => encode({
				type: 'uint64',
				value: -123,
			})).to.throw(Error, 'value is negative'));
			it('uint64 overflow', () => expect(() => encode({
				type: 'uint64',
				value: toTwosPower(64).plus(123),
			})).to.throw(Error, 'uint64 overflow'));
			it('successful', () => strictEqual(encode({
				type: 'uint256',
				value: new BigNumber('115277457729594790111051606095322955253830667489157158755705222607339300572655'),
			}), 'fedcba98765432100123456789abcdeffedcba98765432100123456789abcdef'));
			it('padding on using not big number', () => strictEqual(
				encode({ type: 'uint128', value: 1234567899876543 }),
				'000000000000000000000000000000000000000000000000000462d53d1f8cbf',
			));
			it('different bounds of overflow with signed integer', () => strictEqual(
				encode({ type: 'uint64', value: toTwosPower(63).plus(123) }),
				'000000000000000000000000000000000000000000000000800000000000007b',
			));
			it('as dec string', () => strictEqual(
				encode({ type: 'uint64', value: '123' }),
				'000000000000000000000000000000000000000000000000000000000000007b',
			));
			it('as hex string', () => strictEqual(
				encode({ type: 'uint64', value: '0xdead' }),
				'000000000000000000000000000000000000000000000000000000000000dead',
			));
		});
		describe('signed', () => {
			it('int64 overflow', () => {
				for (const value of [
					toTwosPower(63).plus(123),
					toTwosPower(63).times(-1).minus(123),
				]) expect(() => encode({ type: 'int64', value })).to.throw(Error, 'int64 overflow');
			});
			it('positive', () => strictEqual(encode({
				type: 'int256',
				value: new BigNumber('15277457729594790111051606095322955253830667489157158755705222607339300572655'),
			}), '21c6bc11c65958fdb73436b075b82f3154443f2a068192100123456789abcdef'));
			it('negative', () => strictEqual(encode({
				type: 'int256',
				value: new BigNumber('-15277457729594790111051606095322955253830667489157158755705222607339300572655'),
			}), 'de3943ee39a6a70248cbc94f8a47d0ceabbbc0d5f97e6deffedcba9876543211'));
			it('padding on using not big number', () => strictEqual(
				encode({ type: 'int128', value: -1234567899876543 }),
				'00000000000000000000000000000000fffffffffffffffffffb9d2ac2e07341',
			));
		});
	});

	describe('address', () => {
		it('not a string', () => expect(() => encode({
			type: 'address',
			value: 123,
		})).to.throw(Error, 'address is not a string'));
		it('invalid format', () => {
			for (const invalidAddress of invalidAddressesIds) {
				expect(() => encode({
					type: 'address',
					value: invalidAddress,
				})).to.throw(Error, 'invalid address format');
			}
		});
		it('objectId gt 2**152', () => expect(() => encode({
			type: 'address',
			value: `1.${PROTOCOL_OBJECT_TYPE_ID.CONTRACT}.${toTwosPower(152).plus(123).toString(10)}`,
		})).to.throw(Error, 'objectId is greater or equals to 2**152'));
		it('objectId eqt 2**152', () => expect(() => encode({
			type: 'address',
			value: `1.${PROTOCOL_OBJECT_TYPE_ID.CONTRACT}.${toTwosPower(152).toString(10)}`,
		})).to.throw(Error, 'objectId is greater or equals to 2**152'));
		describe('successful', () => {
			it('account', () => strictEqual(
				encode({ type: 'address', value: '1.2.123' }),
				'000000000000000000000000000000000000000000000000000000000000007b',
			));
			it('contract', () => strictEqual(
				encode({ type: 'address', value: `1.${PROTOCOL_OBJECT_TYPE_ID.CONTRACT}.321` }),
				'0000000000000000000000000100000000000000000000000000000000000141',
			));
			it('preoverflow', () => strictEqual(encode({
				type: 'address',
				value: `1.${PROTOCOL_OBJECT_TYPE_ID.CONTRACT}.5708990770823839524233143877797980545530986495`,
			}), '00000000000000000000000001ffffffffffffffffffffffffffffffffffffff'));
		});
	});

	describe('static bytes', () => {
		for (const { test, type, value, error } of [
			{ test: 'not a hex string', type: 'bytes10', value: 'qwe', error: 'input is not a hex string' },
			{ test: 'large input', type: 'bytes2', value: '0x012345', error: 'input is too large' },
			{
				test: 'short input',
				type: 'bytes3',
				value: '0x0123',
				error: 'input is too short, maybe u need to use align?',
			},
			{
				test: 'unknown align',
				type: 'bytes3',
				value: { value: '0x12', align: 'qwe' },
				error: 'unknown align',
			},
		]) it(test, () => expect(() => encode({ type, value })).to.throw(Error, error));

		describe('invalid bytes count', () => {
			for (const { test, bytesCount, error } of [
				{ test: 'zero', bytesCount: 0, error: 'bytes count is not positive' },
				{ test: 'gt 32', bytesCount: 33, error: 'bytes count is grater than 32' },
			]) {
				it(test, () => expect(() => encode({
					type: `bytes${bytesCount}`,
					value: Buffer.from([]),
				})).to.throws(Error, error));
			}
		});

		for (const { test, input } of [
			{ test: 'hex string without align', input: '0x01234500' },
			{ test: 'hex string as object', input: { value: '0x01234500' } },
			{ test: 'hex without 0x', input: '01234500' },
			{ test: 'buffer', input: Buffer.from([1, 35, 69, 0]) },
			{ test: 'ascii', input: { value: '\x01#E\0', encoding: 'ascii' } },
			{ test: 'utf8', input: { value: '\x01#E\0', encoding: 'utf8' } },
			{ test: 'utf16le', input: { value: '⌁E', encoding: 'utf16le' } },
		]) {
			it(test, () => strictEqual(
				encode({ type: 'bytes4', value: input }),
				'0000000000000000000000000000000000000000000000000000000001234500',
			));
		}
	});

	describe('arrays', () => {
		it('multidimensional arrays', () => strictEqual(encode([
			{ value: 1, type: 'uint256' },
			{ value: [[[], [1]], [[2, 3], [4, 5, 6]]], type: 'uint256[][2][]' },
			{ value: 4, type: 'uint256' },
		]), [
			'0000000000000000000000000000000000000000000000000000000000000001',
			'0000000000000000000000000000000000000000000000000000000000000060',
			'0000000000000000000000000000000000000000000000000000000000000004',
			'0000000000000000000000000000000000000000000000000000000000000002',
			'0000000000000000000000000000000000000000000000000000000000000100',
			'0000000000000000000000000000000000000000000000000000000000000120',
			'0000000000000000000000000000000000000000000000000000000000000160',
			'00000000000000000000000000000000000000000000000000000000000001c0',
			'0000000000000000000000000000000000000000000000000000000000000000',
			'0000000000000000000000000000000000000000000000000000000000000001',
			'0000000000000000000000000000000000000000000000000000000000000001',
			'0000000000000000000000000000000000000000000000000000000000000002',
			'0000000000000000000000000000000000000000000000000000000000000002',
			'0000000000000000000000000000000000000000000000000000000000000003',
			'0000000000000000000000000000000000000000000000000000000000000003',
			'0000000000000000000000000000000000000000000000000000000000000004',
			'0000000000000000000000000000000000000000000000000000000000000005',
			'0000000000000000000000000000000000000000000000000000000000000006',
		].join('')));
		it('several dynamic arrays of static arrays', () => strictEqual(encode([
			{ type: 'uint32[2][]', value: [[1, 2], [3, 4]] },
			{ type: 'uint32[2][]', value: [[5, 6]] },
		]), [
			'0000000000000000000000000000000000000000000000000000000000000040',
			'00000000000000000000000000000000000000000000000000000000000000e0',
			'0000000000000000000000000000000000000000000000000000000000000002',
			'0000000000000000000000000000000000000000000000000000000000000001',
			'0000000000000000000000000000000000000000000000000000000000000002',
			'0000000000000000000000000000000000000000000000000000000000000003',
			'0000000000000000000000000000000000000000000000000000000000000004',
			'0000000000000000000000000000000000000000000000000000000000000001',
			'0000000000000000000000000000000000000000000000000000000000000005',
			'0000000000000000000000000000000000000000000000000000000000000006',
		].join('')));
	});

	describe('string', () => {
		it('default encoding', () => strictEqual(encode({ type: 'string', value: '0af' }), [
			'0000000000000000000000000000000000000000000000000000000000000020',
			'0000000000000000000000000000000000000000000000000000000000000003',
			'3061660000000000000000000000000000000000000000000000000000000000',
		].join('')));
		it('set encoding', () => strictEqual(encode({
			type: 'string',
			value: { value: '\u2301\u6745', encoding: 'utf16le' },
		}), [
			'0000000000000000000000000000000000000000000000000000000000000020',
			'0000000000000000000000000000000000000000000000000000000000000004',
			'0123456700000000000000000000000000000000000000000000000000000000',
		].join('')));
	});

	describe('bytes', () => {
		it('as buffer', () => strictEqual(encode({ type: 'bytes', value: Buffer.from([0x12, 0x34, 0x56]) }), [
			'0000000000000000000000000000000000000000000000000000000000000020',
			'0000000000000000000000000000000000000000000000000000000000000003',
			'1234560000000000000000000000000000000000000000000000000000000000',
		].join('')));
		it('as object without encoding', () => strictEqual(encode({
			type: 'bytes',
			value: { value: 'abcdef' },
		}), [
			'0000000000000000000000000000000000000000000000000000000000000020',
			'0000000000000000000000000000000000000000000000000000000000000003',
			'abcdef0000000000000000000000000000000000000000000000000000000000',
		].join('')));
		it('strict size', () => strictEqual(encode({
			type: 'bytes', value: '0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
		}), [
			'0000000000000000000000000000000000000000000000000000000000000020',
			'0000000000000000000000000000000000000000000000000000000000000020',
			'0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
		].join('')));
	});

	describe('dynamic array', () => {
		it('is not an array', () => expect(() => encode({
			type: 'uint8[]',
			value: 'not_an_array',
		})).to.throws(Error, 'value is not an array'));
	});

	describe('static array', () => {
		for (const { test, value } of [
			{ test: 'value is not an array', value: 'not_an_array' },
			{ test: 'invalid array elements count', value: [1, 2] },
		]) it(test, () => expect(() => encode({ type: 'uint8[4]', value })).to.throw(Error, test));
	});

	it('invalid type', () => expect(() => encode({
		type: 'invalid_type',
		value: 123,
	})).to.throw(Error, 'unknown type invalid_type'));
});
