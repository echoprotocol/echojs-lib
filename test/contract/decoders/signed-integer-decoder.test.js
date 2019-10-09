import 'mocha';
import { ok, strictEqual } from 'assert';
import BigNumber from 'bignumber.js';
import { expect } from 'chai';
import { decodeSignedInteger } from '../../../src/contract/decoders';
import bitsCountTests from './_bitsCount.test';
import valueTests from './_value.test';
import decode from '../../../src/contract/decoders';

describe('signed integer', () => {
	describe('failure', () => {
		describe('invalid bitsCount', () => {
			for (const { test, bitsCount } of bitsCountTests) {
				it(test, () => expect(() => decodeSignedInteger(bitsCount, 'any')).to.throw(Error, test));
			}
		});
		describe('invalid value format', () => {
			for (const { test, value, error } of valueTests) {
				it(test, () => expect(() => decodeSignedInteger(64, value)).to.throw(Error, error || test));
			}
		});
		it('overflow', () => {
			expect(() => {
				// 2 ** 64
				decodeSignedInteger(64, '0000000000000000000000000000000000000000000000010000000000000000');
			}).to.throw(Error, 'int64 overflow');
		});
	});
	describe('successful', () => {
		it('positive int48', () => {
			const res = decodeSignedInteger(48, '0000000000000000000000000000000000000000000000000000321da639d85d');
			strictEqual(res, 55102924249181);
		});
		it('negative int48', () => {
			const res = decodeSignedInteger(48, '0000000000000000000000000000000000000000000000000000c2d6dc442d31');
			strictEqual(res, -67246902465231);
		});
		it('positive int56', () => {
			const res = decodeSignedInteger(56, '00000000000000000000000000000000000000000000000000533ae15e672ec9');
			ok(BigNumber.isBigNumber(res));
			ok(res.eq('23427162692857545'), res.toString(10));
		});
		it('negative int56', () => {
			const res = decodeSignedInteger(56, '00000000000000000000000000000000000000000000000000ed9f6649feb4b3');
			ok(BigNumber.isBigNumber(res));
			ok(res.eq('-5172762880592717'), res.toString(10));
		});
		it('positive int256', () => {
			const res = decodeSignedInteger(256, '36b8e7eb36fde2a4f60da788f808435db7072d99ce1eb5eddd2b4c4b174f4ff5');
			ok(BigNumber.isBigNumber(res));
			const expectedResult = '24751594328200489206266632348604654974920239180038954394182822263079440437237';
			ok(res.eq(expectedResult), res.toString(10));
		});
		it('negative int256', () => {
			const res = decodeSignedInteger(256, 'e48d46a7a052404721af08984428dcd788df018ea5b38c2eecfc72571f56b027');
			ok(BigNumber.isBigNumber(res));
			const expectedResult = '-12415146682758535129430652480807444526257650721696274175727655129804287070169';
			ok(res.eq(expectedResult), res.toString(10));
		});
		it('by default decoder', () => {
			const res = decode('e48d46a7a052404721af08984428dcd788df018ea5b38c2eecfc72571f56b027', ['int256']);
			ok(BigNumber.isBigNumber(res));
			const expectedResult = '-12415146682758535129430652480807444526257650721696274175727655129804287070169';
			ok(res.eq(expectedResult), res.toString(10));
		});
	});
});
