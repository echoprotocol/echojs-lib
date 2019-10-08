import { strictEqual } from 'assert';
import { expect } from 'chai';
import { encodeStaticBytes } from '../../../src/contract/encoders';
import bytesCountTest from '../_bytesCount.test';

describe('encodeStaticBytes', () => {
	for (const { test, bytesCount } of bytesCountTest) {
		it(test, () => expect(() => encodeStaticBytes(bytesCount, 'qwe')).to.throw(Error, test));
	}
	it('align left', () => strictEqual(
		encodeStaticBytes(2, { value: 'af', align: 'left' }),
		'000000000000000000000000000000000000000000000000000000000000af00',
	));
	it('align right', () => strictEqual(
		encodeStaticBytes(2, { value: 'af', align: 'right' }),
		'00000000000000000000000000000000000000000000000000000000000000af',
	));
});
