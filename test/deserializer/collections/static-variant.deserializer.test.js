import { deepStrictEqual } from 'assert';
import { shouldReject } from '../../_test-utils';
import { serializers } from '../../../';

const staticVariantT = serializers.collections.staticVariant;
const { string: stringSer, bool } = serializers.basic;
const { uint32, varint32 } = serializers.basic.integers;

describe('static variant', () => {
	const s = staticVariantT({ 0: uint32, 1: stringSer, 2: bool });
	describe('when invalid key provided', () => {
		const key = 4;
		shouldReject(() => s.deserialize(varint32.serialize(key)), `serializer with key ${key} not found`);
	});
	describe('when should succeed', () => {
		const input = [1, 'qwe'];
		let result;
		let rejects = true;
		it('should not rejects', () => {
			const buffer = s.serialize(input);
			result = s.deserialize(buffer);
			rejects = false;
		});
		it('should returns correct value', function () {
			if (rejects) this.skip();
			deepStrictEqual(result, input);
		});
	});
});
