import { deepStrictEqual } from 'assert';
import { serializers } from '../../../';

const { uint32 } = serializers.basic.integers;
const { bool, string: string_s } = serializers.basic;
const { struct } = serializers.collections;

describe('struct', () => {
	const s = struct({ 'qwe': uint32, 'asd': bool, 'zxc': string_s });
	describe('when should succeed', () => {
		const input = { 'qwe': 123, 'asd': false, 'zxc': 'qwerty' };
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
