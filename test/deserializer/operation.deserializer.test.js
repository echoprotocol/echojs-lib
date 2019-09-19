import { deepEqual } from 'assert';
import { serializers } from '../..';

const { operation: operation_s } = serializers;

describe('operation', () => {
	describe('when should succeed', () => {
		/** @type {import("../../types/serializers/operation").TOperationOutput<0>} */
		const input = [0, {
			fee: { amount: 123, asset_id: '1.3.5' },
			from: '1.2.3',
			to: '1.2.4',
			amount: { amount: 234, asset_id: '1.3.9' },
			extensions: [],
		}];
		const buffer = operation_s.serialize(input);
		/** @type {typeof input} */
		let result;
		let rejects = true;
		it('should not rejects', () => {
			result = operation_s.deserialize(buffer);
			rejects = false;
		});
		it('should returns correct value', function () {
			if (rejects) this.skip();
			deepEqual(result, input);
		});
	});
});
