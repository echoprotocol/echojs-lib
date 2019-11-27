import { deepEqual } from 'assert';
import { serializers } from '../..';

const { operation: operationSer } = serializers;

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
		const buffer = operationSer.serialize(input);
		/** @type {typeof input} */
		let result;
		let rejects = true;
		it('should not rejects', () => {
			result = operationSer.deserialize(buffer);
			rejects = false;
		});
		it('should returns correct value', function () {
			if (rejects) this.skip();
			deepEqual(result, input);
		});
	});
});
