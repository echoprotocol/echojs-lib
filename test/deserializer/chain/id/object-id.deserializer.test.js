import { deepStrictEqual } from 'assert';
import { serializers, constants } from '../../../..';

const { CHAIN_TYPES, PROTOCOL_OBJECT_TYPE_ID } = constants;
const { objectId: objectId_t } = serializers.chain.ids;

describe('object id', () => {
	describe('when should succeed', () => {
		const input = '1.2.345';
		const accountId_s = objectId_t(CHAIN_TYPES.RESERVED_SPACE_ID.PROTOCOL, PROTOCOL_OBJECT_TYPE_ID.ACCOUNT);
		const buffer = accountId_s.serialize(input);
		/** @type {typeof accountId_s['__TOutput__']} */
		let result;
		let rejects = true;
		it('should not rejects', () => {
			result = accountId_s.deserialize(buffer);
			rejects = false;
		});
		it('should returns correct value', function () {
			if (rejects) this.skip();
			deepStrictEqual(result, input);
		});
	});
});
