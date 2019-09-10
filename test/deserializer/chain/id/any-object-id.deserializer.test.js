import { deepStrictEqual } from 'assert';
import { serializers } from '../../../../';

const { anyObjectId } = serializers.chain.ids;

describe('any object id', () => {
	describe('when should succeed', () => {
		const input = '1.2.345';
		const buffer = anyObjectId.serialize(input);
		let rejects = true;
		/** @type {typeof anyObjectId['__TOutput__']} */
		let result;
		it('should not rejects', () => {
			result = anyObjectId.deserialize(buffer);
			rejects = false;
		});
		it('should returns correct value', function () {
			if (rejects) this.skip();
			deepStrictEqual(result, input);
		});
	});
});
