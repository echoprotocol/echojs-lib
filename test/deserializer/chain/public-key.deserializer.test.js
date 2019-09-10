import { deepStrictEqual } from 'assert';
import { shouldReject } from '../../_test-utils';
import { serializers, PrivateKey } from '../../../';

const { publicKey: public_key_s } = serializers.chain;

describe('public key', () => {
	describe('when small buffer provided', () => {
		shouldReject(() => public_key_s.deserialize(Buffer.from([123, 234])), 'unexpected end of buffer');
	});
	describe('when should succeed', () => {
		const input = PrivateKey.fromSeed('test').toPublicKey();
		/** @type {Buffer} */
		let buffer;
		before(() => buffer = public_key_s.serialize(input));
		/** @type {typeof public_key_s['__TOutput__']} */
		let result;
		let rejects = true;
		it('should not rejects', () => {
			result = public_key_s.deserialize(buffer);
			rejects = false;
		});
		it('should returns correct value', function () {
			if (rejects) this.skip();
			deepStrictEqual(result, input.toString());
		});
	});
});
