import 'mocha';
import { expect } from 'chai';
import decode, { decodeStaticBytes } from '../../../src/contract/decoders';
import { ok, strictEqual } from 'assert';
import bytesCountTest from '../_bytesCount.test';

describe('static bytes', () => {
	it('successful', () => {
		const code = '0123456789abcdeffedcba987654321001230000000000000000000000000000';
		/** @type Buffer */
		const res = decode(code, ['bytes18']);
		ok(Buffer.isBuffer(res));
		strictEqual(res.toString('hex'), '0123456789abcdeffedcba98765432100123');
	});
	describe('failure', () => {
		it('overflow', () => {
			const code = '0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210';
			const func = () => decode(code, ['bytes24']);
			expect(func).to.throw(Error, 'bytes24 overflow');
		});
		describe('invalid bytes count', () => {
			for (const { test, bytesCount } of bytesCountTest) {
				it(test, () => expect(() => decodeStaticBytes(bytesCount, 'qwe')).to.throw(Error, test));
			}
		});
	});
});
