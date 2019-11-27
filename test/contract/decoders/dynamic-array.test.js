import 'mocha';
import BigNumber from 'bignumber.js';
import { deepStrictEqual, ok, strictEqual } from 'assert';
import { expect } from 'chai';
import { decode } from '../../../';

describe('dynamic array', () => {
	it('invalid offset', () => {
		const code = [
			'000000000000000000000000000000000000000000000000000000000000dead', // offset to next chunk
			'0000000000000000000000000000000000000000000000000000000000000001',
			'0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
		].join('');
		const func = () => decode(code, ['uint256[]']);
		expect(func).to.throw(Error, 'invalid offset');
	});
	it('single array', () => {
		const code = [
			'0000000000000000000000000000000000000000000000000000000000000020', // offset to next chunk
			'0000000000000000000000000000000000000000000000000000000000000003',
			'594e158a8a52ff39e0cbcb581a51940e5105d51383aa1ba676f8e214f0306fb8',
			'664db280f788d85238a3db1b1034e2a7905a4c577876c600b77e0b84067af38b',
			'e4ca1631628c289def072da993b63d0191adb571d1aadeabf912da0a7b7b92fd',
		].join('');
		const res = decode(code, ['uint256[]']);
		ok(Array.isArray(res));
		strictEqual(res.length, 3);
		const expectedResults = [
			'40393806266676584437755220339361291911275477630832742212595292166818372808632',
			'46273189767272440134904293994423341371457811516773246020914698249784488817547',
			'103484385753905248778390947944422951340612094383824644796051262783048805749501',
		];
		for (let i = 0; i < res.length; i += 1) {
			const element = res[i];
			ok(BigNumber.isBigNumber(element));
			ok(element.eq(expectedResults[i]));
		}
	});
	it('multidimensional array', () => {
		const expectedResult = [[1, 2], [3, 4, 5], [6, 7, 8, 9]];
		const code = [
			'0000000000000000000000000000000000000000000000000000000000000020',
			'0000000000000000000000000000000000000000000000000000000000000003',
			'00000000000000000000000000000000000000000000000000000000000000a0',
			'0000000000000000000000000000000000000000000000000000000000000100',
			'0000000000000000000000000000000000000000000000000000000000000180',
			'0000000000000000000000000000000000000000000000000000000000000002',
			'0000000000000000000000000000000000000000000000000000000000000001',
			'0000000000000000000000000000000000000000000000000000000000000002',
			'0000000000000000000000000000000000000000000000000000000000000003',
			'0000000000000000000000000000000000000000000000000000000000000003',
			'0000000000000000000000000000000000000000000000000000000000000004',
			'0000000000000000000000000000000000000000000000000000000000000005',
			'0000000000000000000000000000000000000000000000000000000000000004',
			'0000000000000000000000000000000000000000000000000000000000000006',
			'0000000000000000000000000000000000000000000000000000000000000007',
			'0000000000000000000000000000000000000000000000000000000000000008',
			'0000000000000000000000000000000000000000000000000000000000000009',
		].join('');
		const res = decode(code, ['uint32[][]']);
		deepStrictEqual(res, expectedResult);
	});
	it('dynamic array of static arrays', () => {
		const expectedResult = [[1, 2], [3, 4], [5, 6]];
		const code = [
			'0000000000000000000000000000000000000000000000000000000000000020',
			'0000000000000000000000000000000000000000000000000000000000000003',
			'0000000000000000000000000000000000000000000000000000000000000001',
			'0000000000000000000000000000000000000000000000000000000000000002',
			'0000000000000000000000000000000000000000000000000000000000000003',
			'0000000000000000000000000000000000000000000000000000000000000004',
			'0000000000000000000000000000000000000000000000000000000000000005',
			'0000000000000000000000000000000000000000000000000000000000000006',
		].join('');
		const res = decode(code, ['uint32[2][]']);
		deepStrictEqual(res, expectedResult);
	});
	it('with other arguments', () => {
		const expectedResult = [1, [2, 3, 4], 5];
		const code = [
			'0000000000000000000000000000000000000000000000000000000000000001',
			'0000000000000000000000000000000000000000000000000000000000000060',
			'0000000000000000000000000000000000000000000000000000000000000005',
			'0000000000000000000000000000000000000000000000000000000000000003',
			'0000000000000000000000000000000000000000000000000000000000000002',
			'0000000000000000000000000000000000000000000000000000000000000003',
			'0000000000000000000000000000000000000000000000000000000000000004',
		].join('');
		const res = decode(code, ['uint32', 'uint32[]', 'uint32']);
		deepStrictEqual(res, expectedResult);
	});
});
