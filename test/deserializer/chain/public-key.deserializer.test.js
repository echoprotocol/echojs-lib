import { deepStrictEqual } from 'assert';
import { shouldReject } from '../../_test-utils';
import { serializers, PrivateKey } from '../../../';

const { publicKey: publicKeySer } = serializers.chain;

describe('public key', () => {
	describe('when small buffer provided', () => {
		shouldReject(() => publicKeySer.deserialize(Buffer.from([123, 234])), 'unexpected end of buffer');
	});
	describe('when should succeed', () => {
		const input = PrivateKey.fromSeed('test').toPublicKey();
		/** @type {Buffer} */
		let buffer;
		before(() => {
			buffer = publicKeySer.serialize(input);
			return buffer;
		});
		/** @type {typeof public_key_s['__TOutput__']} */
		let result;
		let rejects = true;
		it('should not rejects', () => {
			result = publicKeySer.deserialize(buffer);
			rejects = false;
		});
		it('should returns correct value', function () {
			if (rejects) this.skip();
			deepStrictEqual(result, input.toString());
		});
	});
});
