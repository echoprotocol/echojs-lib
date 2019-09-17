import { shouldReject } from '../../_test-utils';
import { serializers } from '../../../';
import { deepStrictEqual } from 'assert';

const static_variant_t = serializers.collections.staticVariant;
const { string: string_s, bool } = serializers.basic;
const { uint32, varint32 } = serializers.basic.integers;

describe('static variant', () => {
	const s = static_variant_t({ 0: uint32, 1: string_s, 2: bool });
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
